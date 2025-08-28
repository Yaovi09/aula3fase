import { prismaClient } from "../prisma/prisma.js";

export const prontuarioRouter = Router();
// Prontuario
prontuarioRouter.get('/prontuarios', async (_, response) => {
    try {
        const prontuarios = await prismaClient.prontuario.findMany();
        return response.json(prontuarios)
    }
    catch (e) {
        console.log(e)
    }
});

prontuarioRouter.get("/prontuarios/:id", async (request, response) => {
    try {
        const prontuarios = await prismaClient.prontuario.findUnique({
            where: {
                id: Number(request.params.id)
            }
        })
        if (!prontuarios) return response.status(404).send("Prontuario não existe!")
        return response.json(prontuarios)
    }
    catch (e) {
        console.log(e)
    }
})

prontuarioRouter.post("/prontuarios", async (req, res) => {
    try {
        const { body } = req
        const bodyKeys = Object.keys(body)
        for (const key of bodyKeys) {
            if (key !== "descricao" &&
                key !== "data" &&
                key !== "medico_responsavel_id" &&
                key !== "paciente_id" 
            ) return res.status(404).send("Colunas não existentes")
        }
        const prontuarios = await prismaClient.prontuario.create({
            data: {
                ...body,
                data: new Date(body.data) // corrigir esse cara no put quando nao se manda ele... TO-DO
            },
        })
        return res.status(201).json(prontuarios)
    } catch (error) {
        console.error(error)
        if (error.code === "P2002") {
            res.status(404).send("Falha ao cadastrar paciente: Email já cadastrado!")
        }
    }
})

prontuarioRouter.put("/prontuarios/:id", async (req, res) => {
    try {
        const { body, params } = req
        const bodyKeys = Object.keys(body)
        for (const key of bodyKeys) {
            if (key !== "descricao" &&
                key !== "data" &&
                key !== "medico_responsavel_id" &&
                key !== "paciente_id" 
            ) return res.status(404).send("Colunas não existentes")
        }
        await prismaClient.prontuario.update({
            where: { id: Number(params.id) },
            data: {
                ...body
            },
        })
        const prontuarioAtualizado = await prismaClient.prontuario.findUnique({
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

prontuarioRouter.delete("/prontuarios/:id", async (req, res) => {
    const { params } = req
    try {
        const prontuarioDeletado = await prismaClient.prontuario.delete({
            where: {
                id: Number(params.id),
            },
        })
        res.status(200).json({
            message: "Exame deletado!",
            data: prontuarioDeletado
        })
    } catch (error) {
        if (error.code == "P2025") {
            res.status(404).send("Paciente não existe no banco")
        }
    }
})
