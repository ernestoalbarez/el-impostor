# El Impostor

Juego social de deducción diseñado para generar incertidumbre, conversación y engaño.  
Este proyecto fue creado utilizando **Lovable** como generador base y se desarrolla localmente como una aplicación web moderna y responsive.

---

## ¿De qué trata el juego?

**El Impostor** es un juego por turnos donde los jugadores deben descubrir quién (o quiénes) no conocen la palabra correcta antes de que se termine el tiempo.

La clave del juego no es solo mentir bien, sino **no saber en qué confiar**.

---

## Roles principales

Dependiendo del modo de juego, los jugadores pueden asumir distintos roles:

- **Civil**
  - Conoce la palabra principal (o una variación válida).
  - Gana si todos los impostores son eliminados.

- **Impostor**
  - No conoce la palabra principal.
  - Puede recibir una palabra relacionada… o ninguna.
  - Gana si el tiempo termina y sigue activo.

### Roles especiales (modos avanzados)

- **🕶️ Falso impostor**
  - Es civil, pero recibe una palabra relacionada.
  - Para el grupo, es indistinguible de un impostor real.

- **Impostor sin palabra**
  - Es impostor real.
  - No recibe ninguna palabra y debe improvisar completamente.

---

## Modos de juego

### Modo Clásico
- Cantidad de impostores definida manualmente.
- Los jugadores conocen su rol desde el inicio.
- Experiencia directa y estratégica.

### Modo Misterio
- La app decide aleatoriamente cuántos impostores hay.
- Los roles se asignan de forma aleatoria.
- Ningún jugador conoce su rol al inicio.
- Cada jugador recibe una palabra o pista sin saber qué rol ocupa.
- Los roles se revelan únicamente cuando un jugador es eliminado.
- Al finalizar la partida, se muestran todos los roles.

### Modo Caos
- Incluye roles especiales como falso impostor e impostor sin palabra.
- Puede haber variaciones de palabra incluso entre civiles.
- Los impostores pueden no saber si están solos.
- El diseño busca generar desorden intencional e incertidumbre constante.

---

## Palabras y temáticas

Las palabras **no se generan automáticamente**.

Cada temática contiene:
- Una palabra principal
- Variaciones para civiles
- Un conjunto limitado de palabras relacionadas (para impostores)

Las temáticas pueden:
- Gestionarse desde la app
- Importarse desde un archivo JSON

Esto permite controlar el balance y evitar ambigüedades no deseadas.

---

## Flujo de una partida

1. Configuración de jugadores, modo y temática.
2. Asignación aleatoria de roles y palabras.
3. Cada jugador ve su información de forma privada.
4. La app elige al azar quién comienza.
5. Corre el tiempo y los jugadores discuten.
6. Se vota para eliminar jugadores.
7. Se determina el equipo ganador.
8. Se registran estadísticas.

---

## Estadísticas

El juego mantiene estadísticas persistentes por jugador:
- Victorias como civil
- Victorias como impostor
- Total de partidas jugadas

---

## Stack tecnológico

Este proyecto está construido con:

- **Lovable** – generación y evolución del proyecto mediante prompts
- **Vite** – bundler rápido para desarrollo moderno
- **React + TypeScript** – UI declarativa y tipada
- **Tailwind CSS** – estilos utilitarios
- **shadcn/ui** – componentes accesibles y reutilizables

Arquitectura orientada a:
- Estados claros del juego
- Separación entre lógica, datos y UI
- Escalabilidad de reglas y modos

---

## Desarrollo local

Requisitos:
- Node.js
- npm

```bash
git clone git@github.com:ernestoalbarez/el-impostor.git
cd el-impostor
npm install
npm run dev
```

---

## 🧪 Filosofía del diseño

- El juego **no ayuda a deducir**
- La ambigüedad es una feature, no un bug
- El diseño prioriza conversación y paranoia
- Ninguna partida debería sentirse igual a otra

---

## 📌 Nota final

Este proyecto es un experimento de diseño social tanto como un juego.  
Si algo se siente incómodo o incierto… probablemente esté funcionando.

---

## 📄 Licencia

Este proyecto se distribuye bajo la **Licencia MIT**.

Esto significa que podés:
- Usar el código libremente
- Modificarlo
- Distribuirlo
- Utilizarlo en proyectos personales o comerciales

Siempre que incluyas el aviso de copyright y la licencia original.

---

## ☕ Support / Contribuciones

El proyecto se mantiene sin publicidad ni funciones bloqueadas.  
Si querés ayudar a cubrir costos de hosting, dominio y mantenimiento, podés hacerlo de forma voluntaria.

### MercadoPago / Cafecito
Podés colaborar mediante MercadoPago desde la página de soporte dentro de la aplicación.

### Criptomonedas (ERC‑20)

Se aceptan:

- **USDC**
- **USDT**

Redes soportadas:
- Ethereum (Mainnet)
- Polygon

La aplicación incluye:
- Dirección pública visible
- Botón de copiado rápido
- QR compatible con estándar **EIP‑681** para abrir directamente el token correcto en wallets como MetaMask

Las contribuciones son completamente opcionales y solo buscan cubrir costos operativos.

© 2026 Ernesto Albarez