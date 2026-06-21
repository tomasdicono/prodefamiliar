# Guía de Configuración de Firebase para tu Prode Familiar 2026

Esta aplicación web es híbrida. Actualmente está funcionando en **Modo Local** (guardando todo en tu navegador mediante `localStorage`). Para que toda tu familia pueda ingresar pronósticos desde sus propios celulares o computadoras y ver la tabla de posiciones en tiempo real, debes conectar la aplicación a un proyecto gratuito de **Firebase Firestore**.

Sigue estos sencillos pasos para configurarlo en menos de 5 minutos:

---

## Paso 1: Crear un proyecto en Firebase

1. Ingresa a la consola de Firebase: **[console.firebase.google.com](https://console.firebase.google.com/)** e inicia sesión con tu cuenta de Google.
2. Haz clic en **"Agregar proyecto"** (o "Crear un proyecto").
3. Asigna un nombre a tu proyecto, por ejemplo: `Prode Mundial Familiar`.
4. Haz clic en **"Continuar"**.
5. *(Opcional)* Puedes desactivar Google Analytics para este proyecto ya que no lo utilizaremos, luego haz clic en **"Crear proyecto"**.
6. Espera unos segundos a que se cree el proyecto y presiona **"Continuar"**.

---

## Paso 2: Crear la Base de Datos (Cloud Firestore)

1. En el menú lateral izquierdo de tu panel de Firebase, haz clic en **"Compilación"** (o "Build") y luego selecciona **"Firestore Database"**.
2. Haz clic en el botón central **"Crear base de datos"**.
3. Selecciona la ubicación del servidor de tu base de datos (por defecto la sugerida es ideal, ej: `nam5-us-central`) y presiona **"Siguiente"**.
4. Selecciona **"Iniciar en modo de prueba"** (esto habilitará las reglas de lectura y escritura para que tu familia pueda guardar sus puntajes inmediatamente) y presiona **"Crear"**.
5. *¡Listo!* Tu base de datos Firestore ya está activa y esperando datos.

---

## Paso 3: Registrar la Aplicación Web y Obtener las Credenciales

1. Vuelve a la pantalla principal del panel de tu proyecto de Firebase (haz clic en el ícono de casa de **Descripción general del proyecto** en la parte superior izquierda).
2. En el centro de la pantalla, verás unos íconos redondos para agregar plataformas. Haz clic en el ícono de **Web** (tiene el símbolo `</>`).
3. Registra tu aplicación asignándole un apodo (ejemplo: `Prode Web`). No es necesario activar Firebase Hosting. Haz clic en **"Registrar app"**.
4. Firebase te mostrará un bloque de código que contiene un objeto llamado `firebaseConfig`. Se ve parecido a esto:

   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxx",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:xxxxxxxxxxxxxxxxx"
   };
   ```

---

## Paso 4: Pegar las Credenciales en tu Proyecto

1. Abre la carpeta del proyecto en tu escritorio: `Prode Familiar`.
2. Abre el archivo **`app.js`** con cualquier editor de texto (Notepad, bloc de notas, VS Code, etc.).
3. En las primeras líneas de **`app.js`**, busca la constante `FIREBASE_CONFIG`:

   ```javascript
   const FIREBASE_CONFIG = {
     apiKey: "",
     authDomain: "",
     projectId: "",
     storageBucket: "",
     messagingSenderId: "",
     appId: ""
   };
   ```

4. Copia los valores correspondientes que te dio Firebase y pégalos entre las comillas de cada campo de la constante.
5. Guarda el archivo **`app.js`**.

---

## Paso 5: ¡A Jugar!

1. Vuelve a abrir o refresca el archivo **`index.html`** en tu navegador.
2. Verás que el banner superior gris ha cambiado a un banner verde brillante con el texto:  
   **"Modo Nube: Los pronósticos y resultados están sincronizados en tiempo real. 🟢"**
3. El sistema sembrará automáticamente todos los partidos y los usuarios iniciales en la base de datos de tu nube en el primer inicio.
4. ¡Ahora comparte el enlace del archivo o toda la carpeta con tus familiares para que todos carguen sus predicciones!
