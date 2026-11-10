/**
 * ============================================================================
 * LEXOPOLY — CONFIGURACIÓN DEL TABLERO PERIMETRAL 9x9 (CASILLAS 0 A 31)
 * ============================================================================
 * Cuadrícula CSS de 9x9 donde las 32 casillas perimetrales se recorren en
 * sentido horario comenzando en la esquina superior izquierda (fila 1, col 1).
 */
(function (global) {
  'use strict';

  const TILE_TYPES = {
    CIVIL: {
      code: 'PREGUNTA_CIVIL',
      label: 'Pregunta Civil',
      branch: 'Derecho Civil',
      shortBranch: 'Civil',
      color: '#2B5B84',
      cssClass: 'branch-civil'
    },
    PENAL: {
      code: 'PREGUNTA_PENAL',
      label: 'Pregunta Penal',
      branch: 'Derecho Penal',
      shortBranch: 'Penal',
      color: '#AD4147',
      cssClass: 'branch-penal'
    },
    CONSTITUCIONAL: {
      code: 'PREGUNTA_CONSTITUCIONAL',
      label: 'Pregunta Constitucional',
      branch: 'Derecho Constitucional',
      shortBranch: 'Constitucional',
      color: '#B18B46',
      cssClass: 'branch-constitucional'
    },
    ADMINISTRATIVO: {
      code: 'PREGUNTA_ADMINISTRATIVO',
      label: 'Pregunta Administrativo',
      branch: 'Derecho Administrativo',
      shortBranch: 'Administrativo',
      color: '#21734F',
      cssClass: 'branch-administrativo'
    },
    ESPECIAL: {
      code: 'CONSTITUCIONAL_ESPECIAL',
      label: 'Constitucional / Especial',
      branch: 'Constitucional / Especial',
      shortBranch: 'Especial',
      color: '#B18B46',
      cssClass: 'branch-especial'
    },
    JURISPRUDENCIA: {
      code: 'JURISPRUDENCIA_FAVORABLE',
      label: 'Jurisprudencia Favorable',
      branch: 'Jurisprudencia Favorable',
      shortBranch: 'Jurisprudencia',
      color: '#8A6522',
      cssClass: 'branch-jurisprudencia'
    },
    VACIO: {
      code: 'VACIO_LEGAL',
      label: 'Vacío Legal',
      branch: 'Vacío Legal',
      shortBranch: 'Vacío Legal',
      color: '#64748B',
      cssClass: 'branch-vacio'
    }
  };

  /**
   * 32 Casillas Perimetrales (ID 0 a 31) en cuadrícula 9x9:
   * - Borde Superior: fila 1, columnas 1 a 9 (IDs 0..8)
   * - Borde Derecho:  fila 2 a 8, columna 9  (IDs 9..15)
   * - Borde Inferior: fila 9, columnas 9 a 1 (IDs 16..24)
   * - Borde Izquierdo: fila 8 a 2, columna 1 (IDs 25..31)
   */
  const BOARD_TILES = [
    // ==================== BORDE SUPERIOR (Fila 1, Col 1 -> 9) ====================
    {
      id: 0,
      displayNum: '01',
      name: 'Salida',
      type: TILE_TYPES.ESPECIAL.code,
      typeMeta: TILE_TYPES.ESPECIAL,
      questionCategory: 'CONSTITUCIONAL',
      row: 1,
      col: 1,
      coord: '(1,1)',
      isCorner: true,
      icon: 'flag',
      description: 'Inicio de la instancia procesal.Completar un circuito otorga +25 puntos de Impulso Procesal.'
    },
    {
      id: 1,
      displayNum: '02',
      name: 'Personas',
      type: TILE_TYPES.CIVIL.code,
      typeMeta: TILE_TYPES.CIVIL,
      questionCategory: 'CIVIL',
      row: 1,
      col: 2,
      coord: '(1,2)',
      isCorner: false,
      icon: 'users',
      description: 'Sujetos de derecho, personalidad jurídica, atributos de la persona natural y jurídica.'
    },
    {
      id: 2,
      displayNum: '03',
      name: 'Obligaciones',
      type: TILE_TYPES.CIVIL.code,
      typeMeta: TILE_TYPES.CIVIL,
      questionCategory: 'CIVIL',
      row: 1,
      col: 3,
      coord: '(1,3)',
      isCorner: false,
      icon: 'handshake',
      description: 'Vínculo jurídico, fuentes de las obligaciones, mora, pago, novación y compensación.'
    },
    {
      id: 3,
      displayNum: '04',
      name: 'Jurisprudencia',
      type: TILE_TYPES.JURISPRUDENCIA.code,
      typeMeta: TILE_TYPES.JURISPRUDENCIA,
      questionCategory: 'CONSTITUCIONAL',
      row: 1,
      col: 4,
      coord: '(1,4)',
      isCorner: false,
      icon: 'pillar',
      description: 'Jurisprudencia Favorable: otorga +15 pts inmediatos por doctrina vinculante y habilita reto de bonificación.'
    },
    {
      id: 4,
      displayNum: '05',
      name: 'Contratos',
      type: TILE_TYPES.CIVIL.code,
      typeMeta: TILE_TYPES.CIVIL,
      questionCategory: 'CIVIL',
      row: 1,
      col: 5,
      coord: '(1,5)',
      isCorner: false,
      icon: 'contract',
      description: 'Autonomía de la voluntad, pacta sunt servanda, vicios del consentimiento y resolución contractual.'
    },
    {
      id: 5,
      displayNum: '06',
      name: 'Patrimonio',
      type: TILE_TYPES.CIVIL.code,
      typeMeta: TILE_TYPES.CIVIL,
      questionCategory: 'CIVIL',
      row: 1,
      col: 6,
      coord: '(1,6)',
      isCorner: false,
      icon: 'briefcase',
      description: 'Prenda general de los acreedores, derechos reales, posesión, usucapión y garantías.'
    },
    {
      id: 6,
      displayNum: '07',
      name: 'Prueba',
      type: TILE_TYPES.CIVIL.code,
      typeMeta: TILE_TYPES.CIVIL,
      questionCategory: 'CIVIL',
      preferredCaseId: 'JP-004',
      row: 1,
      col: 7,
      coord: '(1,7)',
      isCorner: false,
      icon: 'scales',
      description: 'Carga de la prueba (onus probandi), licitud probatoria y valoración racional de la evidencia.'
    },
    {
      id: 7,
      displayNum: '08',
      name: 'Recursos',
      type: TILE_TYPES.ADMINISTRATIVO.code,
      typeMeta: TILE_TYPES.ADMINISTRATIVO,
      questionCategory: 'ADMINISTRATIVO',
      row: 1,
      col: 8,
      coord: '(1,8)',
      isCorner: false,
      icon: 'file-text',
      description: 'Recursos en vía administrativa y judicial: reposición, alzada/apelación y agotamiento de vía.'
    },
    {
      id: 8,
      displayNum: '09',
      name: 'Biblioteca',
      type: TILE_TYPES.JURISPRUDENCIA.code,
      typeMeta: TILE_TYPES.JURISPRUDENCIA,
      questionCategory: 'CIVIL',
      row: 1,
      col: 9,
      coord: '(1,9)',
      isCorner: true,
      icon: 'book-open',
      description: 'Esquina de Jurisprudencia Favorable: consulta doctrinal que otorga +20 pts de Prestigio Jurídico.'
    },

    // ==================== BORDE DERECHO (Col 9, Fila 2 -> 8) ====================
    {
      id: 9,
      displayNum: '10',
      name: 'Garantías',
      type: TILE_TYPES.CONSTITUCIONAL.code,
      typeMeta: TILE_TYPES.CONSTITUCIONAL,
      questionCategory: 'CONSTITUCIONAL',
      row: 2,
      col: 9,
      coord: '(2,9)',
      isCorner: false,
      icon: 'shield-check',
      description: 'Tutela judicial efectiva, debido proceso, amparo constitucional y hábeas corpus.'
    },
    {
      id: 10,
      displayNum: '11',
      name: 'Audiencia',
      type: TILE_TYPES.PENAL.code,
      typeMeta: TILE_TYPES.PENAL,
      questionCategory: 'PENAL',
      row: 3,
      col: 9,
      coord: '(3,9)',
      isCorner: false,
      icon: 'message-square',
      description: 'Principios de oralidad, inmediación, contradicción y publicidad en el juicio penal.'
    },
    {
      id: 11,
      displayNum: '12',
      name: 'Argumentación',
      type: TILE_TYPES.CONSTITUCIONAL.code,
      typeMeta: TILE_TYPES.CONSTITUCIONAL,
      questionCategory: 'CONSTITUCIONAL',
      row: 4,
      col: 9,
      coord: '(4,9)',
      isCorner: false,
      icon: 'cap',
      description: 'Ponderación de principios, test de proporcionalidad y motivación de las resoluciones.'
    },
    {
      id: 12,
      displayNum: '13',
      name: 'Ética',
      type: TILE_TYPES.ESPECIAL.code,
      typeMeta: TILE_TYPES.ESPECIAL,
      questionCategory: 'CONSTITUCIONAL',
      row: 5,
      col: 9,
      coord: '(5,9)',
      isCorner: false,
      icon: 'heart-handshake',
      description: 'Deontología jurídica, secreto profesional, lealtad procesal y deber de probidad.'
    },
    {
      id: 13,
      displayNum: '14',
      name: 'Doctrina',
      type: TILE_TYPES.ADMINISTRATIVO.code,
      typeMeta: TILE_TYPES.ADMINISTRATIVO,
      questionCategory: 'ADMINISTRATIVO',
      row: 6,
      col: 9,
      coord: '(6,9)',
      isCorner: false,
      icon: 'bookmark',
      description: 'Acto administrativo, presunción de legitimidad, silencio administrativo y desviación de poder.'
    },
    {
      id: 14,
      displayNum: '15',
      name: 'Mediación',
      type: TILE_TYPES.CIVIL.code,
      typeMeta: TILE_TYPES.CIVIL,
      questionCategory: 'CIVIL',
      row: 7,
      col: 9,
      coord: '(7,9)',
      isCorner: false,
      icon: 'handshake',
      description: 'Métodos alternativos de solución de controversias (MASC), transacción y arbitraje.'
    },
    {
      id: 15,
      displayNum: '16',
      name: 'Sentencia',
      type: TILE_TYPES.PENAL.code,
      typeMeta: TILE_TYPES.PENAL,
      questionCategory: 'PENAL',
      row: 8,
      col: 9,
      coord: '(8,9)',
      isCorner: false,
      icon: 'gavel',
      description: 'Cosa juzgada, congruencia procesal, in dubio pro reo y determinación judicial de la pena.'
    },

    // ==================== BORDE INFERIOR (Fila 9, Col 9 -> 1) ====================
    {
      id: 16,
      displayNum: '17',
      name: 'Receso',
      type: TILE_TYPES.VACIO.code,
      typeMeta: TILE_TYPES.VACIO,
      questionCategory: 'ADMINISTRATIVO',
      row: 9,
      col: 9,
      coord: '(9,9)',
      isCorner: true,
      icon: 'coffee',
      description: 'Esquina de Vacío Legal / Suspensión de Audiencia: laguna normativa que exige integración jurídica.'
    },
    {
      id: 17,
      displayNum: '18',
      name: 'Propiedad',
      type: TILE_TYPES.CIVIL.code,
      typeMeta: TILE_TYPES.CIVIL,
      questionCategory: 'CIVIL',
      row: 9,
      col: 8,
      coord: '(9,8)',
      isCorner: false,
      icon: 'key',
      description: 'Dominio, acción reivindicatoria, servidumbres, usufructo y función social de la propiedad.'
    },
    {
      id: 18,
      displayNum: '19',
      name: 'Responsabilidad',
      type: TILE_TYPES.ADMINISTRATIVO.code,
      typeMeta: TILE_TYPES.ADMINISTRATIVO,
      questionCategory: 'ADMINISTRATIVO',
      row: 9,
      col: 7,
      coord: '(9,7)',
      isCorner: false,
      icon: 'scales',
      description: 'Responsabilidad patrimonial del Estado, daño antijurídico, nexo causal y falta de servicio.'
    },
    {
      id: 19,
      displayNum: '20',
      name: 'Precedente',
      type: TILE_TYPES.JURISPRUDENCIA.code,
      typeMeta: TILE_TYPES.JURISPRUDENCIA,
      questionCategory: 'CONSTITUCIONAL',
      row: 9,
      col: 6,
      coord: '(9,6)',
      isCorner: false,
      icon: 'pillar',
      description: 'Jurisprudencia Favorable: ratio decidendi vinculante (+15 pts inmediatos y reto de alto prestigio).'
    },
    {
      id: 20,
      displayNum: '21',
      name: 'Capacidad',
      type: TILE_TYPES.CIVIL.code,
      typeMeta: TILE_TYPES.CIVIL,
      questionCategory: 'CIVIL',
      row: 9,
      col: 5,
      coord: '(9,5)',
      isCorner: false,
      icon: 'user-check',
      description: 'Capacidad de goce y de ejercicio, apoyos y salvaguardias, nulidad absoluta y relativa.'
    },
    {
      id: 21,
      displayNum: '22',
      name: 'Plazos',
      type: TILE_TYPES.VACIO.code,
      typeMeta: TILE_TYPES.VACIO,
      questionCategory: 'ADMINISTRATIVO',
      row: 9,
      col: 4,
      coord: '(9,4)',
      isCorner: false,
      icon: 'timer',
      description: 'Vacío Legal y Términos Procesales: caducidad de la instancia, prescripción y preclusión.'
    },
    {
      id: 22,
      displayNum: '23',
      name: 'Buena fe',
      type: TILE_TYPES.CIVIL.code,
      typeMeta: TILE_TYPES.CIVIL,
      questionCategory: 'CIVIL',
      row: 9,
      col: 3,
      coord: '(9,3)',
      isCorner: false,
      icon: 'heart',
      description: 'Principio general de buena fe objetiva, doctrina de los actos propios (venire contra factum proprium).'
    },
    {
      id: 23,
      displayNum: '24',
      name: 'Procedimiento',
      type: TILE_TYPES.ADMINISTRATIVO.code,
      typeMeta: TILE_TYPES.ADMINISTRATIVO,
      questionCategory: 'ADMINISTRATIVO',
      row: 9,
      col: 2,
      coord: '(9,2)',
      isCorner: false,
      icon: 'list-checks',
      description: 'Debido procedimiento administrativo, motivación del acto, notificación y nulidad de pleno derecho.'
    },
    {
      id: 24,
      displayNum: '25',
      name: 'Tribunal',
      type: TILE_TYPES.ESPECIAL.code,
      typeMeta: TILE_TYPES.ESPECIAL,
      questionCategory: 'CONSTITUCIONAL',
      row: 9,
      col: 1,
      coord: '(9,1)',
      isCorner: true,
      icon: 'courthouse',
      description: 'Esquina Constitucional / Especial: Control de Constitucionalidad en el Alto Tribunal.'
    },

    // ==================== BORDE IZQUIERDO (Col 1, Fila 8 -> 2) ====================
    {
      id: 25,
      displayNum: '26',
      name: 'Competencia',
      type: TILE_TYPES.CONSTITUCIONAL.code,
      typeMeta: TILE_TYPES.CONSTITUCIONAL,
      questionCategory: 'CONSTITUCIONAL',
      row: 8,
      col: 1,
      coord: '(8,1)',
      isCorner: false,
      icon: 'sitemap',
      description: 'Juez natural, jurisdicción y factores de competencia (materia, cuantía, territorio y fuero).'
    },
    {
      id: 26,
      displayNum: '27',
      name: 'Interpretación',
      type: TILE_TYPES.CONSTITUCIONAL.code,
      typeMeta: TILE_TYPES.CONSTITUCIONAL,
      questionCategory: 'CONSTITUCIONAL',
      row: 7,
      col: 1,
      coord: '(7,1)',
      isCorner: false,
      icon: 'scan',
      description: 'Métodos hermenéuticos, principio pro persona, interpretación conforme y bloque de constitucionalidad.'
    },
    {
      id: 27,
      displayNum: '28',
      name: 'Jurisprudencia II',
      type: TILE_TYPES.JURISPRUDENCIA.code,
      typeMeta: TILE_TYPES.JURISPRUDENCIA,
      questionCategory: 'PENAL',
      row: 6,
      col: 1,
      coord: '(6,1)',
      isCorner: false,
      icon: 'pillar',
      description: 'Jurisprudencia Favorable: unificación de doctrina penal (+15 pts inmediatos y caso especial).'
    },
    {
      id: 28,
      displayNum: '29',
      name: 'Defensa',
      type: TILE_TYPES.PENAL.code,
      typeMeta: TILE_TYPES.PENAL,
      questionCategory: 'PENAL',
      row: 5,
      col: 1,
      coord: '(5,1)',
      isCorner: false,
      icon: 'book',
      description: 'Derecho inviolable a la defensa técnica, causas de justificación (legítima defensa, estado de necesidad).'
    },
    {
      id: 29,
      displayNum: '30',
      name: 'Evidencia',
      type: TILE_TYPES.PENAL.code,
      typeMeta: TILE_TYPES.PENAL,
      questionCategory: 'PENAL',
      row: 4,
      col: 1,
      coord: '(4,1)',
      isCorner: false,
      icon: 'file-search',
      description: 'Cadena de custodia, exclusión de prueba ilícita y doctrina del fruto del árbol envenenado.'
    },
    {
      id: 30,
      displayNum: '31',
      name: 'Deliberación',
      type: TILE_TYPES.PENAL.code,
      typeMeta: TILE_TYPES.PENAL,
      questionCategory: 'PENAL',
      row: 3,
      col: 1,
      coord: '(3,1)',
      isCorner: false,
      icon: 'messages',
      description: 'Teoría del delito: tipicidad, antijuridicidad, culpabilidad, dolo eventual y culpa consciente.'
    },
    {
      id: 31,
      displayNum: '32',
      name: 'Apelación',
      type: TILE_TYPES.PENAL.code,
      typeMeta: TILE_TYPES.PENAL,
      questionCategory: 'PENAL',
      row: 2,
      col: 1,
      coord: '(2,1)',
      isCorner: false,
      icon: 'corner-up-left',
      description: 'Doble instancia, prohibición de la reformatio in peius y casación extraordinaria.'
    }
  ];

  const PLAYER_TOKENS = [
    {
      id: 'balanza',
      name: 'Balanza de la justicia',
      shortName: 'Balanza',
      color: '#D4AC0D',
      bgLight: '#FEF5C8',
      icon: 'scales'
    },
    {
      id: 'birrete',
      name: 'Birrete',
      shortName: 'Birrete',
      color: '#111111',
      bgLight: '#EAEAEA',
      icon: 'cap'
    },
    {
      id: 'codigo',
      name: 'Código civil',
      shortName: 'Código civil',
      color: '#333333',
      bgLight: '#F2F0E6',
      icon: 'book'
    },
    {
      id: 'mazo',
      name: 'Mazo judicial',
      shortName: 'Mazo',
      color: '#1E7E48',
      bgLight: '#ECF6F1',
      icon: 'gavel'
    }
  ];

  global.Lexopoly = global.Lexopoly || {};
  global.Lexopoly.TILE_TYPES = TILE_TYPES;
  global.Lexopoly.BOARD_TILES = BOARD_TILES;
  global.Lexopoly.PLAYER_TOKENS = PLAYER_TOKENS;
})(window);

