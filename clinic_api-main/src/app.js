import express from 'express';
import { usuarioRouter } from './usuarios.js';
import { exameRouter } from './exame.js';
import { pacientesRouter } from './pacientes.js';
import { prontuarioRouter } from './prontuario.js';
import { consultasRouter } from './consulta.js';

export const app = express()
app.use(express.json())

// rotas usuario
app.use(usuarioRouter);

// rotas exames
app.use(exameRouter);

// rotas pacientes
app.use(pacientesRouter);

// rotas prontuario
app.use(prontuarioRouter);

// rotas consulta
app.use(consultasRouter);

app.listen(3000, () => console.log("Api rodandos"))
