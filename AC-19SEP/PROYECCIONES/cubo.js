// Clase Linea
class Linea {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    // Método para dibujar la línea en un contexto 2D
    dibujar(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}

// Clase Cuadrado
class Cuadrado {
    constructor(vertices) {
        this.vertices = vertices; // Array de 4 puntos [ [x1, y1], [x2, y2], [x3, y3], [x4, y4] ]
    }

    // Método para dibujar el cuadrado
    dibujar(ctx) {
        const numVertices = this.vertices.length;
        for (let i = 0; i < numVertices; i++) {
            const [x1, y1] = this.vertices[i];
            const [x2, y2] = this.vertices[(i + 1) % numVertices]; // Conectar el último vértice con el primero
            const linea = new Linea(x1, y1, x2, y2);
            linea.dibujar(ctx);
        }
    }
}

// Clase Cubo
class Cubo {
    constructor(ctx, scale, offsetX, offsetY) {
        this.ctx = ctx;
        this.scale = scale;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        // Definir los vértices del cubo en coordenadas 3D
        this.vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // Cara trasera
            [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]   // Cara frontal
        ];

        // Definir las aristas del cubo
        this.aristas = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Cara trasera
            [4, 5], [5, 6], [6, 7], [7, 4], // Cara frontal
            [0, 4], [1, 5], [2, 6], [3, 7]  // Conexión entre caras
        ];
    }

    // Proyección ortográfica
    orthoProjection([x, y, z]) {
        return [x, y];
    }

    // Proyección en perspectiva
    perspectiveProjection([x, y, z], d = 3) {
        const scale = d / (d - z);
        return [x * scale, y * scale];
    }

    // Proyección isométrica
    isoProjection([x, y, z]) {
        const isoX = x - z;
        const isoY = (x + 2 * y + z) / 3;
        return [isoX, isoY];
    }

    // Método para aplicar una proyección y escalar
    aplicarProyeccion(projectionType, projectionArgs = []) {
        return this.vertices.map(v => {
            const [x, y] = this[projectionType](v, ...projectionArgs);
            return [x * this.scale + this.offsetX, y * this.scale + this.offsetY];
        });
    }

    // Método para dibujar el cubo con una proyección específica
    dibujar(projectionType, projectionArgs = []) {
        // Obtener las coordenadas proyectadas de los vértices
        const projectedVertices = this.aplicarProyeccion(projectionType, projectionArgs);

        // Dibujar las caras del cubo
        const frontFace = new Cuadrado([projectedVertices[4], projectedVertices[5], projectedVertices[6], projectedVertices[7]]);
        const backFace = new Cuadrado([projectedVertices[0], projectedVertices[1], projectedVertices[2], projectedVertices[3]]);

        frontFace.dibujar(this.ctx);
        backFace.dibujar(this.ctx);

        // Dibujar las aristas conectando las caras
        this.aristas.slice(8).forEach(([start, end]) => {
            const [x1, y1] = projectedVertices[start];
            const [x2, y2] = projectedVertices[end];
            const linea = new Linea(x1, y1, x2, y2);
            linea.dibujar(this.ctx);
        });
    }
}

// Inicialización del canvas y contexto
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Parámetros generales
const scale = 100;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Función para añadir títulos
function agregarTitulo(ctx, texto, x, y) {
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(texto, x, y);
}

// Crear instancias del cubo para cada proyección
const cuboOrtho = new Cubo(ctx, scale, centerX - 300, centerY);   // Cubo ortográfico desplazado a la izquierda
const cuboPerspectiva = new Cubo(ctx, scale, centerX, centerY);    // Cubo en perspectiva en el centro
const cuboIso = new Cubo(ctx, scale, centerX + 450, centerY);      // Cubo isométrico aún más desplazado a la derecha

// Limpiar el canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Dibujar los títulos
agregarTitulo(ctx, 'Proyección Ortográfica', centerX - 300, 50);
agregarTitulo(ctx, 'Proyección Perspectiva', centerX, 50);
agregarTitulo(ctx, 'Proyección Isométrica', centerX + 450, 50);  // Título desplazado a la derecha


// Dibujar los cubos con las tres proyecciones
cuboOrtho.dibujar('orthoProjection');
cuboPerspectiva.dibujar('perspectiveProjection', [3]); // Proyección en perspectiva con distancia 3
cuboIso.dibujar('isoProjection');

