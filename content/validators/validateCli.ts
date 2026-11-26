import { validateApprovedCollections } from '@/content/validators/contentValidator';

const report = validateApprovedCollections();

console.log('Teranoo ERP Knowledge Hub — Content Integrity Validation');
console.log(`Files scanned:      ${report.totalFilesScanned}`);
console.log(`Valid records:      ${report.validRecordsCount}`);
console.log(`Published records:  ${report.publishedRecordsCount}`);
console.log(`Errors:             ${report.errors.length}`);
console.log(`Warnings:           ${report.warnings.length}`);

if (report.warnings.length > 0) {
  console.log('\nWarnings (non-blocking):');
  for (const w of report.warnings) {
    console.log(`  [${w.code}] ${w.file} (${w.field}): ${w.message}`);
  }
}

if (report.errors.length > 0) {
  console.error('\nFatal Integrity Errors:');
  for (const e of report.errors) {
    console.error(`  [${e.code}] ${e.file} (${e.field}): ${e.message}`);
  }
  process.exit(1);
}

console.log('\nContent validation passed with 0 fatal errors.');
