import { Router } from "express";
import { prismaClient } from "../prisma/prisma.js";

export const consultasRouter = Router();

app.get('/consultas', async (_, response) => {
    try {
        const consultas = await prismaClient.consulta.findMany();
        return response.json(consultas)
    }
    catch (e) {
        console.log(e)
    }
});

app.get("/consultas/:id", async (request, response) => {
    try {
        const consultas = await prismaClient.consulta.findUnique({
            where: {
                id: Number(request.params.id)
            }
        })
        if (!consultas) return response.status(404).send("Prontuario não existe!")
        return response.json(consultas)
    }
    catch (e) {
        console.log(e)
    }
})

app.post("/consultas", async (req, res) => {
    try {
        const { body } = req
        const bodyKeys = Object.keys(body)
        for (const key of bodyKeys) {
            if (key !== "motivo" &&
                key !== "data_consulta" &&
                key !== "observacoes" &&
                key !== "medico_responsavel_id" &&
                key !== "paciente_id" 
            ) return res.status(404).send("Colunas não existentes")
        }
        const consultas = await prismaClient.consulta.create({
            data: {
                ...body,
                data_consulta: new Date(body.data_consulta) // corrigir esse cara no put quando nao se manda ele... TO-DO
            },
        })
        return res.status(201).json(consultas)
    } catch (error) {
        console.error(error)
        if (error.code === "P2002") {
            res.status(404).send("Falha ao cadastrar paciente: Email já cadastrado!")
        }
    }
})

app.put("/consultas/:id", async (req, res) => {
    try {
        const { body, params } = req
        const bodyKeys = Object.keys(body)
        for (const key of bodyKeys) {
            if (key !== "motivo" &&
                key !== "data_consulta" &&
                key !== "observacoes" &&
                key !== "medico_responsavel_id" &&
                key !== "paciente_id" 
            ) return res.status(404).send("Colunas não existentes")
        }
        await prismaClient.consulta.update({
            where: { id: Number(params.id) },
            data: {
                ...body
            },
        })
        const prontuarioAtualizado = await prismaClient.consulta.findUnique({
            where: {
                id: Number(params.id)
            }
        })

        return res.status(201).json({
            message: "Prontuario atualizado!",
            data: prontuarioAtualizado
        })

    } catch (error) {
        if (error.code == "P2025") {
            res.status(404).send("Usuário não existe no banco")
        }

        if (error.code === "P2002") {
            res.status(404).send("Falha ao cadastrar usuário: Email já cadastrado!")
        }
    }
})

app.delete("/consultas/:id", async (req, res) => {
    const { params } = req
    try {
        const consultaDeletado = await prismaClient.consulta.delete({
            where: {
                id: Number(params.id),
            },
        })
        res.status(200).json({
            message: "Exame deletado!",
            data: consultaDeletado
        })
    } catch (error) {
        if (error.code == "P2025") {
            res.status(404).send("Paciente não existe no banco")
        }
    }
})
