/**
 * Script to clean test evidences from database
 * Run with: node src/database/clean-evidences.js
 */

const pool = require('../config/database');

async function cleanEvidences() {
  try {
    console.log('🧹 Limpiando evidencias de prueba...\n');

    // Delete all evidence files first (due to foreign key constraint)
    const deleteFilesResult = await pool.query('DELETE FROM evidence_files RETURNING id');
    console.log(`✅ ${deleteFilesResult.rows.length} archivos de evidencia eliminados`);

    // Delete all evidences
    const deleteEvidencesResult = await pool.query('DELETE FROM evidences RETURNING id');
    console.log(`✅ ${deleteEvidencesResult.rows.length} evidencias eliminadas`);

    // Delete activity logs related to evidences
    const deleteLogsResult = await pool.query("DELETE FROM activity_logs WHERE entity_type = 'evidence' RETURNING id");
    console.log(`✅ ${deleteLogsResult.rows.length} logs de actividad eliminados`);

    // Reset sequences
    await pool.query('ALTER SEQUENCE evidences_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE evidence_files_id_seq RESTART WITH 1');
    console.log('✅ Secuencias reiniciadas\n');

    console.log('✨ Limpieza completada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar evidencias:', error);
    process.exit(1);
  }
}

cleanEvidences();

