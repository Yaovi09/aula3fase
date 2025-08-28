import { Router } from "express";
import { prismaClient } from '../prisma/prisma.js';

export const exameRouter = Router()

exameRouter.get('/exames', async (_, response) => {
    try {
        const exames = await prismaClient.exame.findMany();
        return response.json(exames)
    }
    catch (e) {
        console.log(e)
    }
});

exameRouter.get("/exames/:id", async (request, response) => {
    try {
        const exames = await prismaClient.exame.findUnique({
            where: {
                id: Number(request.params.id)
            }
        })
        if (!exames) return response.status(404).send("Exame não existe!")
        return response.json(exames)
    }
    catch (e) {
        console.log(e)
    }
})

exameRouter.post("/exames", async (req, res) => {
    try {
        const { body } = req
        const bodyKeys = Object.keys(body)
        for (const key of bodyKeys) {
            if (key !== "tipo_exame" &&
                key !== "resultado" &&
                key !== "data_exame" &&
                key !== "link_arquivo" &&
                key !== "observacoes" &&
                key !== "paciente_id"
            ) return res.status(404).send("Colunas não existentes")
        }
        const exames = await prismaClient.exame.create({
            data: {
                ...body,
                data_exame: new Date(body.data_exame) // corrigir esse cara no put quando nao se manda ele... TO-DO
            },
        })
        return res.status(201).json(exames)
    } catch (error) {
        console.error(error)
        if (error.code === "P2002") {
            res.status(404).send("Falha ao cadastrar paciente: Email já cadastrado!")
        }
    }
})

exameRouter.put("/exames/:id", async (req, res) => {
    try {
        const { body, params } = req
        const bodyKeys = Object.keys(body)
        for (const key of bodyKeys) {
            if (key !== "tipo_exame" &&
                key !== "resultado" &&
                key !== "data_exame" &&
                key !== "link_arquivo" &&
                key !== "observacoes" &&
                key !== "paciente_id"
            ) return res.status(404).send("Colunas não existentes")
        }
        await prismaClient.exame.update({
            where: { id: Number(params.id) },
            data: {
                ...body
            },
        })
        const exameAtualizado = await prismaClient.exame.findUnique({
            where: {
                id: Number(params.id)
            }
        })

        return res.status(201).json({
            message: "Paciente atualizado!",
            data: exameAtualizado
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

exameRouter.delete("/exames/:id", async (req, res) => {
    const { params } = req
    try {
        const exameDeletado = await prismaClient.exame.delete({
            where: {
                id: Number(params.id),
            },
        })
        res.status(200).json({
            message: "Exame deletado!",
            data: exameDeletado
        })
    } catch (error) {
        if (error.code == "P2025") {
            res.status(404).send("Paciente não existe no banco")
        }
    }
})
