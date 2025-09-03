import { prismaClient } from "../../../prisma/prisma.js";

class PacienteController {
  constructor() {}
  async getTodosOsPaciente(_, res) {
    try {
      const pacientes = await prismaClient.paciente.findMany();
      return response.json(pacientes);
    } catch (e) {
      console.log(e);
    }
    
  }
  async getPacientePorId(req, res) {
        try {
            const { params } = req
            const paciente = await prismaClient.paciente.findUnique({
                where: {
                    id: Number(params.id)
                }
            })
            if (!paciente) return res.status(404).send("Paciente não existe!")
            return res.json(paciente)
        }
        catch (e) {
            console.log(e)
        }
    }

  async criarPaciente(req, res) {
    try {
      const { body } = req;
      const bodyKeys = Object.keys(body);
      for (const key of bodyKeys) {
        if (
          key !== "descricao" &&
          key !== "data" &&
          key !== "medico_responsavel_id" &&
          key !== "paciente_id"
        )
          return res.status(404).send("Colunas não existentes");
      }
      const pacientes = await prismaClient.paciente.create({
        data: {
          ...body,
          data: new Date(body.data), // corrigir esse cara no put quando nao se manda ele... TO-DO
        },
      });
      return res.status(201).json(pacientes);
    } catch (error) {
      console.error(error);
    }
  }
  async atualizarPaciente(req, res) {
    try {
      const { body, params } = req;
      const bodyKeys = Object.keys(body);
      for (const key of bodyKeys) {
        if (
          key !== "descricao" &&
          key !== "data" &&
          key !== "medico_responsavel_id" &&
          key !== "paciente_id"
        )
          return res.status(404).send("Colunas não existentes");
      }
      await prismaClient.paciente.update({
        where: { id: Number(params.id) },
        data: {
          ...body,
        },
      });
      const pacienteAtualizado = await prismaClient.paciente.findUnique({
        where: {
          id: Number(params.id),
        },
      });

      return res.status(201).json({
        message: "Prontuario atualizado!",
        data: pacienteAtualizado,
      });
    } catch (error) {
      if (error.code == "P2025") {
        res.status(404).send("paciente não existe no banco");
      }
    }
  }
  async deletarPaciente(req, res) {
    const { params } = req;
    try {
      const pacienteDeletado = await prismaClient.paciente.delete({
        where: {
          id: Number(params.id),
        },
      });
      res.status(200).json({
        message: "paciente deletado!",
        data: pacienteDeletado,
      });
    } catch (error) {
      if (error.code == "P2025") {
        res.status(404).send("paciente não existe no banco");
      }
    }
  }
}

export const pacienteController = new PacienteController();
