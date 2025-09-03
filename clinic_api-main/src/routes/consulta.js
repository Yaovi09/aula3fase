import { Router } from "express";
import {consultaController} from "../controller/Consulta/ConsultaController.js"
export const consultaRouter = Router();


consultaRouter.get('/consultas', consultaController.getTodosOsConsultas);

consultaRouter.get("/consultas/:id", consultaController.getConsultaPorId)

consultaRouter.post("/consultas", consultaController.criarConsulta)

consultaRouter.put("/consultas/:id", consultaController.atualizarConsulta)

consultaRouter.delete("/consultas/:id", consultaController.deletarConsulta)

// consultasRouter.get('/consultas', async (_, response) => {
//     try {
//         const consultas = await prismaClient.consulta.findMany();
//         return response.json(consultas)
//     }
//     catch (e) {
//         console.log(e)
//     }
// });

// consultasRouter.get("/consultas/:id", async (request, response) => {
//     try {
//         const consultas = await prismaClient.consulta.findUnique({
//             where: {
//                 id: Number(request.params.id)
//             }
//         })
//         if (!consultas) return response.status(404).send("Consulta não existe!")
//         return response.json(consultas)
//     }
//     catch (e) {
//         console.log(e)
//     }
// })

// consultasRouter.post("/consultas", async (req, res) => {
//     try {
//         const { body } = req
//         const bodyKeys = Object.keys(body)
//         for (const key of bodyKeys) {
//             if (key !== "motivo" &&
//                 key !== "data_consulta" &&
//                 key !== "observacoes" &&
//                 key !== "medico_responsavel_id" &&
//                 key !== "paciente_id" 
//             ) return res.status(404).send("Colunas não existentes")
//         }
//         const consultas = await prismaClient.consulta.create({
//             data: {
//                 ...body,
//                 data_consulta: new Date(body.data_consulta) // corrigir esse cara no put quando nao se manda ele... TO-DO
//             },
//         })
//         return res.status(201).json(consultas)
//     } catch (error) {
//         console.error(error)
//     }
// })

// consultasRouter.put("/consultas/:id", async (req, res) => {
//     try {
//         const { body, params } = req
//         const bodyKeys = Object.keys(body)
//         for (const key of bodyKeys) {
//             if (key !== "motivo" &&
//                 key !== "data_consulta" &&
//                 key !== "observacoes" &&
//                 key !== "medico_responsavel_id" &&
//                 key !== "paciente_id" 
//             ) return res.status(404).send("Colunas não existentes")
//         }
//         await prismaClient.consulta.update({
//             where: { id: Number(params.id) },
//             data: {
//                 ...body
//             },
//         })
//         const consultaAtualizado = await prismaClient.consulta.findUnique({
//             where: {
//                 id: Number(params.id)
//             }
//         })

//         return res.status(201).json({
//             message: "Consulta atualizado!",
//             data: consultaAtualizado
//         })

//     } catch (error) {
//         if (error.code == "P2025") {
//             res.status(404).send("Consulta não existe no banco")
//         }

//     }
// })

// consultasRouter.delete("/consultas/:id", async (req, res) => {
//     const { params } = req
//     try {
//         const consultaDeletado = await prismaClient.consulta.delete({
//             where: {
//                 id: Number(params.id),
//             },
//         })
//         res.status(200).json({
//             message: "Consulta deletado!",
//             data: consultaDeletado
//         })
//     } catch (error) {
//         if (error.code == "P2025") {
//             res.status(404).send("Consulta não existe no banco")
//         }
//     }
// })
