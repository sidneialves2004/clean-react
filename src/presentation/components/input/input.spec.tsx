import React from 'react'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import Input from './input'
import Context from '@/presentation/contexts/form/form-context'
import faker from 'faker'

const makeSut = (fielName: string): RenderResult => {
  return render(
    <Context.Provider value={ { state: {} } }>
      <Input name={fielName} />)
    </Context.Provider>
  )
}
describe('Input Component', () => {
  test('should begin with readOnly', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const input = sut.getByTestId(field) as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  test('should remove readOnly on focus', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const input = sut.getByTestId(field) as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBe(false)
  })

  test('should receive focus on label click', () => {
    const field: string = faker.database.column()
    const sut = makeSut(field)
    const input = sut.getByTestId(field) as HTMLInputElement
    const label = sut.getByTestId(`${field}-label`) as HTMLLabelElement
    fireEvent.click(label)
    expect(input.focus).toBeTruthy()
  })
})
