import { validateApprovedCollections } from '@/content/validators/contentValidator';
import {
  PROJECT_FOUNDATIONS_SOURCE_MANIFEST,
  deriveSourceManifestSummary,
} from '@/content/manifest/sourceManifest';

const report = validateApprovedCollections();
const manifestSummary = deriveSourceManifestSummary(
  PROJECT_FOUNDATIONS_SOURCE_MANIFEST
);

console.log('Teranoo ERP Knowledge Hub — Content & Source Integrity Validation');
console.log(`Files scanned:              ${report.totalFilesScanned}`);
console.log(`Valid records:              ${report.validRecordsCount}`);
console.log(`Published public records:   ${report.publishedRecordsCount}`);
console.log(`Valid unpublished records:  ${report.unpublishedValidRecordsCount}`);
console.log(
  `Official source manifest:   ${manifestSummary.totalSources} expected | ${manifestSummary.sourceReceivedCount} received | ${manifestSummary.importedCount} imported | ${manifestSummary.publishedCount} published | ${manifestSummary.awaitingSourceCount} awaiting delivery`
);
console.log(`Fatal errors:               ${report.errors.length}`);
console.log(`Warnings (non-blocking):    ${report.warnings.length}`);

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

console.log('\nContent and source manifest validation passed with 0 fatal errors.');
