import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Cliente from 'App/Models/Cliente'
import Gerenciamento from 'App/Models/Gerenciamento'
import Medicamento from 'App/Models/Medicamento'
import { DateTime } from 'luxon'

test.group('MedicinesController Create', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('should returns a statusCode 200 if medicine is deleted', async ({ client, route }) => {
    const medicine = await Medicamento.query().firstOrFail()
    const cliente = new Cliente()
    const password = 'any_senha'
    cliente.nome = 'any_nome'
    cliente.email = 'any_email_rand@mail.com'
    cliente.cpf = '123.123.123-18'
    cliente.password = password
    cliente.dataNascimento = new Date()
    await cliente.save()
    const management = new Gerenciamento()
    management.horaGerenciamento = DateTime.now()
    management.idMedicamento = medicine.id
    management.idCliente = cliente.id
    await management.save()
    const responseAuth = await client.post(route('signin')).json({
      cpf: cliente.cpf,
      senha: password,
    })
    const { body } = responseAuth.body()
    const bearer = `Bearer ${body.cliente.token}`
    const response = await client
      .delete(route('medicines/delete', { id: management!.id }))
      .header('Authorization', bearer)
    response.assertStatus(200)
    const managementDeleted = await Gerenciamento.query().where('id', management!.id).first()
    if (managementDeleted) {
      throw new Error('management not deleted')
    }
    await cliente.delete()
    await management.delete()
  })
})