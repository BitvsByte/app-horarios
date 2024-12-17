# 📅 **Gestor de Horarios para una Empresa**

## Descripción del Proyecto 🚀

Este proyecto es una **aplicación web** de gestión de horarios para una empresa. Cuenta con un **backend** construido en **Node.js** con **Express** y una base de datos **MongoDB**, mientras que el **frontend** está desarrollado con **React**, **Vite** y **TailwindCSS**.

La aplicación permite a **administradores** crear, gestionar y eliminar horarios de los empleados. Los **trabajadores** pueden consultar sus horarios y fichar sus entradas y salidas.

---

## **Tabla de Contenidos**
1. [Características Principales](#características-principales)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Instalación del Proyecto](#instalación-del-proyecto)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Rutas API del Backend](#rutas-api-del-backend)
6. [Vista del Frontend](#vista-del-frontend)
7. [Contribuciones](#contribuciones)
8. [Licencia](#licencia)

---

## **Características Principales** 📋

### **Administrador**
- Crear, actualizar y eliminar horarios de trabajadores.
- Ver todos los horarios en un calendario interactivo.
- Gestionar usuarios (administradores y trabajadores).
- Configuración de permisos mediante roles (`admin` y `worker`).

### **Trabajadores**
- Ver sus horarios mensuales o anuales.
- Fichar **entrada** y **salida** desde la aplicación.
- Consultar horarios de trabajo específicos.

### **Autenticación**
- Inicio de sesión basado en **tokens JWT**.
- Control de acceso mediante **middlewares** en el backend.

---

## **Tecnologías Utilizadas** 🛠️

### **Frontend**
- ⚛️ **React** + **Vite**
- 🎨 **TailwindCSS**
- 🧭 **React Router DOM**
- 🔄 **Axios** (peticiones HTTP)

### **Backend**
- 🖥️ **Node.js** + **Express**
- 🗄️ **MongoDB** (base de datos)
- 🔐 **JWT** para autenticación
- ✅ **Express Validator** para validación de entradas

### **Otros**
- 🌐 **Postman** (para pruebas API)
- 🧪 **Jest** para testing (opcional)

---

## **Instalación del Proyecto** 💻

### **Requisitos previos**
- Node.js instalado en tu máquina.
- MongoDB en ejecución.

