import { prismaClient } from "../../../prisma/prisma.js";

class ConsultaController {
  constructor() {}
  async getTodosOsConsultas(_, res) {
    try {
      const consultas = await prismaClient.consulta.findMany();
      return response.json(consultas);
    } catch (e) {
      console.log(e);
    }
  }
  async getConsultaPorId(req, res) {
    try {
      const consultas = await prismaClient.consulta.findUnique({
        where: {
          id: Number(request.params.id),
        },
      });
      if (!consultas) return response.status(404).send("Consulta não existe!");
      return response.json(consultas);
    } catch (e) {
      console.log(e);
    }
  }

  async criarConsulta(req, res) {
    try {
      const { body } = req;
      const bodyKeys = Object.keys(body);
      for (const key of bodyKeys) {
        if (
          key !== "motivo" &&
          key !== "data_consulta" &&
          key !== "observacoes" &&
          key !== "medico_responsavel_id" &&
          key !== "paciente_id"
        )
          return res.status(404).send("Colunas não existentes");
      }
      const consultas = await prismaClient.consulta.create({
        data: {
          ...body,
          data_consulta: new Date(body.data_consulta), // corrigir esse cara no put quando nao se manda ele... TO-DO
        },
      });

      return res.status(201).json(consultas);
    } catch (error) {
      console.error(error);
    }
  }

  async atualizarConsulta(req, res) {
    try {
      const { body, params } = req;
      const bodyKeys = Object.keys(body);
      for (const key of bodyKeys) {
        if (
          key !== "motivo" &&
          key !== "data_consulta" &&
          key !== "observacoes" &&
          key !== "medico_responsavel_id" &&
          key !== "paciente_id"
        )
          return res.status(404).send("Colunas não existentes");
      }
      await prismaClient.consulta.update({
        where: { id: Number(params.id) },
        data: {
          ...body,
        },
      });
      const consultaAtualizado = await prismaClient.consulta.findUnique({
        where: {
          id: Number(params.id),
        },
      });

      return res.status(201).json({
        message: "Consulta atualizado!",
        data: consultaAtualizado,
      });
    } catch (error) {
      if (error.code == "P2025") {
        res.status(404).send("Consulta não existe no banco");
      }
    }
  }

  async deletarConsulta(req, res) {
    const { params } = req;
    try {
      const consultaDeletado = await prismaClient.consulta.delete({
        where: {
          id: Number(params.id),
        },
      });
      res.status(200).json({
        message: "Consulta deletado!",
        data: consultaDeletado,
      });
    } catch (error) {
      if (error.code == "P2025") {
        res.status(404).send("Consulta não existe no banco");
      }
    }
  }
};

export const consultaController = new ConsultaController();
