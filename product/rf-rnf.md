# Listado completo de requerimientos funcionales y no funcionales

## Requerimientos funcionales

* RF-001: El sistema debe permitir a la empresa cargar descripciones de puestos de trabajo.
* RF-002: El sistema debe permitir a la empresa cargar requerimientos técnicos y herramientas necesarias por puesto.
* RF-003: El sistema debe permitir a la empresa cargar habilidades blandas requeridas por puesto, asociándolas a una rúbrica de evaluación medible.
* RF-004: El sistema debe permitir a la empresa guardar la configuración del proyecto o puesto.
* RF-005: La inteligencia artificial debe generar diversos desafíos técnicos automáticamente, diferenciados por nivel de experiencia, limitando su entrenamiento a documentación de código abierto.
* RF-006: El sistema debe permitir generar información de prueba para los desafíos bajo un modelo de resolución a libro abierto, simulando proyectos reales.
* RF-007: El sistema debe permitir seleccionar el público al que se harán visibles los desafíos.
* RF-008: El sistema debe permitir la creación de consignas, prácticas, exámenes y guías de estudio por parte del docente o recursos humanos.
* RF-009: El sistema debe permitir definir quién tendrá acceso a los materiales creados para colaboración o aprobación.
* RF-010: El talento debe poder realizar los exámenes requeridos múltiples veces.
* RF-011: El sistema debe acumular un historial de puntuación del talento sobre las herramientas evaluadas.
* RF-012: El sistema debe aprovisionar un entorno de ejecución aislado en la nube (sandbox) para que el candidato desarrolle y pruebe su solución técnica.
* RF-013: El entorno de evaluación debe permitir el acceso a internet para la consulta de recursos externos durante la prueba.
* RF-014: El sistema debe registrar exclusivamente el código escrito, el historial de compilación y las ejecuciones realizadas dentro del sandbox.
* RF-015: La inteligencia artificial debe evaluar la entrega analizando el proceso lógico, la eficiencia y las buenas prácticas, en lugar de validar únicamente el resultado final.
* RF-016: El sistema debe ofrecer instancias para testear la cultura del empleado utilizando rúbricas medibles predefinidas.
* RF-017: El sistema debe permitir la realización de los desafíos en las oficinas de la empresa con salas dedicadas.
* RF-018: El sistema debe ofrecer organigramas y flujos de procesos para la capacitación de candidatos avanzados.
* RF-019: El sistema debe generar prácticas de habilidades por rol y por carrera de estudio.
* RF-020: El sistema debe entrenar al usuario en los conceptos de uso de las herramientas de la empresa.
* RF-021: El sistema debe entrenar al usuario en los conceptos fundamentales de la inteligencia artificial.
* RF-022: La inteligencia artificial debe generar ejercicios para activar el pensamiento crítico en lugar de proporcionar respuestas directas.
* RF-023: La inteligencia artificial debe cruzar conocimientos entre materias y herramientas para generar ejercicios prácticos integradores.
* RF-024: El sistema debe permitir al estudiante introducir la bibliografía de la materia para enfocar el contenido.
* RF-025: La inteligencia artificial debe utilizar bases de código abierto o licenciamiento estandarizado como referencia para evaluar los conceptos de la bibliografía.
* RF-026: El sistema debe mantener una base de talentos disponible mensualmente.
* RF-027: El sistema debe permitir filtrar la base de talentos por los exámenes realizados y sus puntuaciones.
* RF-028: El sistema debe permitir que los chats con la inteligencia artificial puedan convertirse en públicos y ser compartidos entre usuarios.
* RF-029: El sistema debe automatizar y generar reportes semanales sobre el progreso del talento y estructurar los resultados en métricas exactas.
* RF-030: El sistema debe permitir la publicación automática de capacitaciones en portales de trabajo o redes sociales permitidas.
* RF-031: El sistema debe permitir a empresas proveedoras otorgar certificados por los entrenamientos ofrecidos.
* RF-032: El sistema debe gestionar la suscripción mensual requerida para universidades y empresas.
* RF-033: El sistema debe aprender e improvisar los desafíos con el tiempo para evitar la repetición y mejorar su calidad evaluativa.
* RF-034: El sistema debe proporcionar una retroalimentación detallada y automática para que los candidatos revisen sus resultados posprueba.
* RF-035: El sistema debe ofrecer una capacitación adaptable basada en el rendimiento histórico y el nivel de experiencia del usuario.

## Requerimientos no funcionales

* RNF-001: El tiempo de generación del desafío técnico por parte de la inteligencia artificial no debe superar los 15 segundos.
* RNF-002: El entorno aislado de ejecución en la nube debe inicializarse y estar operativo en un tiempo máximo de 10 segundos.
* RNF-003: El sistema debe soportar un mínimo de 100 usuarios concurrentes ejecutando entornos aislados simultáneamente sin degradación notable del servicio.
* RNF-004: La información personal de los talentos, historiales, puntuaciones y configuraciones debe estar encriptada en tránsito y en reposo.
* RNF-005: El sistema debe implementar una autenticación robusta y multifactor para el acceso de empresas, recursos humanos y profesores.
* RNF-006: El sistema tiene estrictamente prohibido solicitar permisos para grabar audio, video o capturar la pantalla del dispositivo local del usuario.
* RNF-007: Se deben cumplir obligatoriamente las normativas internacionales y locales de privacidad y protección de datos.
* RNF-008: La interfaz de usuario para la carga de puestos y la visualización de reportes debe ser intuitiva para los gestores.
* RNF-009: La interfaz gráfica de evaluación para el candidato debe ser minimalista y no generar distracciones innecesarias.
* RNF-010: El sistema central debe garantizar una alta disponibilidad, asegurando un tiempo de actividad del 99.9%.
* RNF-011: La arquitectura del proyecto debe estructurarse utilizando contenedores para facilitar la escalabilidad y un despliegue rápido.
* RNF-012: El sistema debe registrar en una bitácora de auditoría todas las interacciones clave, inicios de sesión y finalización de pruebas.
* RNF-013: Debe existir un panel de monitoreo en tiempo real para visualizar el estado de los servicios y el avance de los talentos.
* RNF-014: El sistema debe incluir mecanismos para incentivar a los usuarios mediante bonificaciones y un esquema de recomendaciones.
* RNF-015: El sistema debe incorporar alertas automáticas en tiempo real para el monitoreo proactivo por parte de los administradores.