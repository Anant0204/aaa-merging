/**
 * deploy.js — Railway Safe Startup Script & Auto-Migration Enforcer
 *
 * Guarantees Phase 2 & Phase B database schema columns & tables exist on production MySQL/MariaDB:
 *   - documents.checklistItemId, version, reviewedById, reviewedAt
 *   - application_cycles phase 2 columns
 *   - resubmission_checklist_items table
 *   - consultations.clientId
 *   - relocation_packages.isRefundable
 *   - leads.companyName, leads.dealValue, leads.currency
 *   - leads_companyName_idx index on leads(companyName)
 */

'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function columnExists(table, column) {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) AS cnt
       FROM information_schema.columns
       WHERE table_schema = DATABASE()
         AND table_name   = ?
         AND column_name  = ?`,
      table,
      column
    );
    return Number(rows[0].cnt) > 0;
  } catch (e) {
    return false;
  }
}

async function tableExists(table) {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) AS cnt
       FROM information_schema.tables
       WHERE table_schema = DATABASE()
         AND table_name   = ?`,
      table
    );
    return Number(rows[0].cnt) > 0;
  } catch (e) {
    return false;
  }
}

async function indexExists(table, indexName) {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) AS cnt
       FROM information_schema.statistics
       WHERE table_schema = DATABASE()
         AND table_name   = ?
         AND index_name   = ?`,
      table,
      indexName
    );
    return Number(rows[0].cnt) > 0;
  } catch (e) {
    return false;
  }
}

async function ensurePhase2Schema() {
  console.log('[Deploy] Checking database schema for Phase 2 columns & tables...');

  // 1. Ensure resubmission_checklist_items table exists
  const hasChecklistTable = await tableExists('resubmission_checklist_items');
  if (!hasChecklistTable) {
    console.log('[Deploy] Creating table `resubmission_checklist_items`...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`resubmission_checklist_items\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`applicationId\` VARCHAR(191) NOT NULL,
        \`templateKey\` VARCHAR(191) NOT NULL,
        \`belongsTo\` VARCHAR(191) NOT NULL DEFAULT 'Main Applicant',
        \`category\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(191) NOT NULL,
        \`isMandatory\` BOOLEAN NOT NULL DEFAULT true,
        \`dueDate\` DATETIME(3) NULL,
        \`clientInstructions\` TEXT NULL,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'MISSING',
        \`sourceDocumentId\` VARCHAR(191) NULL,
        \`activeDocumentId\` VARCHAR(191) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL,
        UNIQUE INDEX \`resubmission_checklist_items_activeDocumentId_key\`(\`activeDocumentId\`),
        INDEX \`resubmission_checklist_items_applicationId_idx\`(\`applicationId\`),
        INDEX \`resubmission_checklist_items_status_idx\`(\`status\`),
        INDEX \`resubmission_checklist_items_sourceDocumentId_idx\`(\`sourceDocumentId\`),
        UNIQUE INDEX \`rci_appId_tmplKey_belongsTo_key\`(\`applicationId\`, \`templateKey\`, \`belongsTo\`),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    console.log('[Deploy] Table `resubmission_checklist_items` created successfully.');
  } else {
    console.log('[Deploy] Table `resubmission_checklist_items`: OK');
  }

  // 2. Ensure documents table columns exist
  const docCols = [
    { name: 'checklistItemId', sql: 'ALTER TABLE `documents` ADD COLUMN `checklistItemId` VARCHAR(191) NULL;' },
    { name: 'version',          sql: 'ALTER TABLE `documents` ADD COLUMN `version` INT NOT NULL DEFAULT 1;' },
    { name: 'reviewedById',     sql: 'ALTER TABLE `documents` ADD COLUMN `reviewedById` VARCHAR(191) NULL;' },
    { name: 'reviewedAt',       sql: 'ALTER TABLE `documents` ADD COLUMN `reviewedAt` DATETIME(3) NULL;' }
  ];

  for (const col of docCols) {
    const exists = await columnExists('documents', col.name);
    if (!exists) {
      console.log(`[Deploy] Adding column \`documents.${col.name}\`...`);
      try {
        await prisma.$executeRawUnsafe(col.sql);
        console.log(`[Deploy] Column \`documents.${col.name}\` added.`);
      } catch (err) {
        console.log(`[Deploy] Note on \`documents.${col.name}\`: ${err.message}`);
      }
    } else {
      console.log(`[Deploy] Column \`documents.${col.name}\`: OK`);
    }
  }

  // 3. Ensure application_cycles table columns exist
  const cycleCols = [
    { name: 'submissionReference',  sql: 'ALTER TABLE `application_cycles` ADD COLUMN `submissionReference` VARCHAR(191) NULL;' },
    { name: 'submissionNotes',      sql: 'ALTER TABLE `application_cycles` ADD COLUMN `submissionNotes` TEXT NULL;' },
    { name: 'submissionReceiptUrl', sql: 'ALTER TABLE `application_cycles` ADD COLUMN `submissionReceiptUrl` VARCHAR(191) NULL;' },
    { name: 'submittedById',        sql: 'ALTER TABLE `application_cycles` ADD COLUMN `submittedById` VARCHAR(191) NULL;' },
    { name: 'submittedAt',          sql: 'ALTER TABLE `application_cycles` ADD COLUMN `submittedAt` DATETIME(3) NULL;' },
    { name: 'closureReason',        sql: 'ALTER TABLE `application_cycles` ADD COLUMN `closureReason` TEXT NULL;' },
    { name: 'closedById',           sql: 'ALTER TABLE `application_cycles` ADD COLUMN `closedById` VARCHAR(191) NULL;' },
    { name: 'closedAt',             sql: 'ALTER TABLE `application_cycles` ADD COLUMN `closedAt` DATETIME(3) NULL;' }
  ];

  for (const col of cycleCols) {
    const exists = await columnExists('application_cycles', col.name);
    if (!exists) {
      console.log(`[Deploy] Adding column \`application_cycles.${col.name}\`...`);
      try {
        await prisma.$executeRawUnsafe(col.sql);
        console.log(`[Deploy] Column \`application_cycles.${col.name}\` added.`);
      } catch (err) {
        console.log(`[Deploy] Note on \`application_cycles.${col.name}\`: ${err.message}`);
      }
    } else {
      console.log(`[Deploy] Column \`application_cycles.${col.name}\`: OK`);
    }
  }

  // 4. Ensure consultations table columns exist
  const consultationCols = [
    { name: 'clientId', sql: 'ALTER TABLE `consultations` ADD COLUMN `clientId` VARCHAR(191) NULL;' }
  ];

  for (const col of consultationCols) {
    const exists = await columnExists('consultations', col.name);
    if (!exists) {
      console.log(`[Deploy] Adding column \`consultations.${col.name}\`...`);
      try {
        await prisma.$executeRawUnsafe(col.sql);
        console.log(`[Deploy] Column \`consultations.${col.name}\` added.`);
      } catch (err) {
        console.log(`[Deploy] Note on \`consultations.${col.name}\`: ${err.message}`);
      }
    } else {
      console.log(`[Deploy] Column \`consultations.${col.name}\`: OK`);
    }
  }

  // 5. Ensure relocation_packages table isRefundable column exists
  const pkgCols = [
    { name: 'isRefundable', sql: 'ALTER TABLE `relocation_packages` ADD COLUMN `isRefundable` BOOLEAN NOT NULL DEFAULT false;' }
  ];

  for (const col of pkgCols) {
    const exists = await columnExists('relocation_packages', col.name);
    if (!exists) {
      console.log(`[Deploy] Adding column \`relocation_packages.${col.name}\`...`);
      try {
        await prisma.$executeRawUnsafe(col.sql);
        console.log(`[Deploy] Column \`relocation_packages.${col.name}\` added.`);
      } catch (err) {
        console.log(`[Deploy] Note on \`relocation_packages.${col.name}\`: ${err.message}`);
      }
    } else {
      console.log(`[Deploy] Column \`relocation_packages.${col.name}\`: OK`);
    }
  }
}

async function ensurePhaseBSchema() {
  console.log('[Deploy] Checking database schema for Phase B leads commercial fields...');

  // 1. Verify required leads table exists
  const hasLeadsTable = await tableExists('leads');
  if (!hasLeadsTable) {
    throw new Error('Required table `leads` does not exist in the database.');
  }

  // 2. Ensure leads table commercial columns exist
  const leadCols = [
    {
      name: 'companyName',
      sql: 'ALTER TABLE `leads` ADD COLUMN `companyName` VARCHAR(191) NULL AFTER `budget`;'
    },
    {
      name: 'dealValue',
      sql: 'ALTER TABLE `leads` ADD COLUMN `dealValue` DECIMAL(12, 2) NULL AFTER `companyName`;'
    },
    {
      name: 'currency',
      sql: "ALTER TABLE `leads` ADD COLUMN `currency` VARCHAR(10) NOT NULL DEFAULT 'USD' AFTER `dealValue`;"
    }
  ];

  for (const col of leadCols) {
    const exists = await columnExists('leads', col.name);
    if (!exists) {
      console.log(`[Deploy] Adding column \`leads.${col.name}\`...`);
      try {
        await prisma.$executeRawUnsafe(col.sql);
      } catch (err) {
        throw new Error(`Failed to add column \`leads.${col.name}\`: ${err.message}`);
      }

      // Verify column exists after creation
      const verified = await columnExists('leads', col.name);
      if (!verified) {
        throw new Error(`Verification failed: Column \`leads.${col.name}\` was not created.`);
      }
      console.log(`[Deploy] Column \`leads.${col.name}\` added and verified.`);
    } else {
      console.log(`[Deploy] Column \`leads.${col.name}\`: OK`);
    }
  }

  // 3. Ensure leads_companyName_idx index exists
  const hasIndex = await indexExists('leads', 'leads_companyName_idx');
  if (!hasIndex) {
    console.log('[Deploy] Creating index `leads_companyName_idx` on `leads`(`companyName`)...');
    try {
      await prisma.$executeRawUnsafe('CREATE INDEX `leads_companyName_idx` ON `leads` (`companyName`);');
    } catch (err) {
      throw new Error(`Failed to create index \`leads_companyName_idx\`: ${err.message}`);
    }

    // Verify index exists after creation
    const indexVerified = await indexExists('leads', 'leads_companyName_idx');
    if (!indexVerified) {
      throw new Error('Verification failed: Index `leads_companyName_idx` was not created.');
    }
    console.log('[Deploy] Index `leads_companyName_idx` created and verified.');
  } else {
    console.log('[Deploy] Index `leads_companyName_idx`: OK');
  }

  // 4. Safe repeatable backfill: only backfills where companyName is NULL and qualificationData has valid non-empty companyName
  try {
    const backfillSql = `
      UPDATE \`leads\`
      SET \`companyName\` = JSON_UNQUOTE(JSON_EXTRACT(\`qualificationData\`, '$.companyName'))
      WHERE \`companyName\` IS NULL
        AND \`qualificationData\` IS NOT NULL
        AND JSON_VALID(\`qualificationData\`) = 1
        AND JSON_EXTRACT(\`qualificationData\`, '$.companyName') IS NOT NULL
        AND JSON_UNQUOTE(JSON_EXTRACT(\`qualificationData\`, '$.companyName')) != ''
        AND JSON_UNQUOTE(JSON_EXTRACT(\`qualificationData\`, '$.companyName')) != 'null';
    `;
    const backfilled = await prisma.$executeRawUnsafe(backfillSql);
    if (backfilled > 0) {
      console.log(`[Deploy] Backfilled companyName for ${backfilled} lead(s) from qualificationData.`);
    }
  } catch (err) {
    console.warn(`[Deploy] Note on \`leads.companyName\` backfill: ${err.message}`);
  }
}

async function main() {
  console.log('[Deploy] ===== AAA Backend Startup =====');

  try {
    await ensurePhase2Schema();
    console.log('[Deploy] All Phase 2 database schema checks complete.');

    await ensurePhaseBSchema();
    console.log('[Deploy] All Phase B database schema checks complete.');
  } catch (err) {
    console.error(`[Deploy] FATAL: Database schema initialization failed: ${err.message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  console.log('[Deploy] Launching Express server (src/app)...');
  require('./src/app');
}

main();
