import { Router } from "express";
import { prismaClient } from "../prisma/prisma.js";
export const usuarioRouter = Router()

usuarioRouter.get('/usuarios', async (request, response) => {
    try {
        const usuarios = await prismaClient.usuario.findMany();
        return response.json(usuarios)
    }
    catch (e) {
        console.log(e)
    }
});

usuarioRouter.get("/usuarios/:id", async (request, response) => {
    try {
        const usuario = await prismaClient.usuario.findUnique({
            where: {
                id: Number(request.params.id)
            }
        })
        if (!usuario) return response.status(404).send("Usuário não existe!")
        return response.json(usuario)
    }
    catch (e) {
        console.log(e)
    }
})

usuarioRouter.post("/usuarios", async (req, res) => {
    try {
        const { body } = req
        const usuario = await prismaClient.usuario.create({
            data: {
                nome: body.nome,
                cargo: body.cargo,
                email: body.email,
                senha: body.senha
            },
        })
        return res.status(201).json(usuario)
    } catch (error) {
        console.error(error)
        if (error.code === "P2002") {
            res.status(404).send("Falha ao cadastrar usuário: Email já cadastrado!")
        }
    }
})

usuarioRouter.put("/usuarios/:id", async (req, res) => {
    try {
        const { body, params } = req
        if (body.nome || body.cargo || body.email || body.senha) {
            await prismaClient.usuario.update({
                where: { id: Number(params.id) },
                data: {
                    ...body
                },
            })

            const usuarioAtualizado = await prismaClient.usuario.findUnique({
                where: {
                    id: Number(params.id)
                }
            })

            res.status(201).json({
                message: "Usuário atualizado!",
                data: usuarioAtualizado
            })
        } else {
            res.status(404).send("Atributos enviados não condizem com o schema")
        }
    } catch (error) {
        if (error.code == "P2025") {
            res.status(404).send("Usuário não existe no banco")
        }
        if (error.code === "P2002") {
            res.status(404).send("Falha ao cadastrar usuário: Email já cadastrado!")
        }
    }
})

usuarioRouter.delete("/usuarios/:id", async (req, res) => {
    const { params } = req
    try {
        const usuarioDeletado = await prismaClient.usuario.delete({
            where: {
                id: Number(params.id),
            },
        })
        res.status(200).json({
            message: "Usuário deletado!",
            data: usuarioDeletado
        })
    } catch (error) {
        if (error.code == "P2025") {
            res.status(404).send("Usuário não existe no banco")
        }
    }
})