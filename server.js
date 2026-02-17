const fastify = require('fastify')({ logger: true });
const fastifyJwt = require('@fastify/jwt');

// 1. Registrar el plugin de JWT
fastify.register(fastifyJwt, {
  secret: 'SUPER_SECRET_KEY_EXPO_2026' // Cambiamos esto después
});

// 2. Middleware para proteger rutas
fastify.decorate("authenticate", async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// 3. Ruta de Login (Genera el Token)
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;
  
  // Aquí vamos a validar con la database
  if (username === 'admin' && password === 'admin123') {
    const token = fastify.jwt.sign({ 
      user: username, 
      role: 'hr_manager' 
    });
    return { token };
  }
  
  return reply.code(401).send({ message: 'Credenciales inválidas' });
});

// 4. Ruta Protegida (Ejemplo: Ver CVs)
fastify.get('/candidates', { onRequest: [fastify.authenticate] }, async (request, reply) => {
  return { message: "Lista de candidatos cargada", user: request.user };
});

// 5. Iniciamos el servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
