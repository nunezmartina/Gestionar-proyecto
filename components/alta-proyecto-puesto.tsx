"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, Plus } from "lucide-react"

interface ProyectoPuesto {
  codPP: number
  cantidadVacantes: number
  cantidadSuPostulaciones: number
  horasDedicadas: number
  fechaBajaProyectoPuesto?: string
  puesto: {
    codPuesto: string
    nombrePuesto: string
  }
}

interface AltaProyectoPuestoProps {
  onSave: (puesto: ProyectoPuesto) => void
  onCancel: () => void
  existingPuestos: ProyectoPuesto[]
}

export function AltaProyectoPuesto({ onSave, onCancel, existingPuestos }: AltaProyectoPuestoProps) {
  const [formData, setFormData] = useState({
    cantidadSuPostulaciones: "",
    cantidadVacantes: "",
    horasDedicadas: "",
    codPuesto: "",
  })
  const [errors, setErrors] = useState<string[]>([])

  const validateForm = () => {
    const newErrors: string[] = []

    // Validar campos requeridos
    if (
      !formData.cantidadSuPostulaciones.trim() ||
      !formData.cantidadVacantes.trim() ||
      !formData.horasDedicadas.trim() ||
      !formData.codPuesto.trim()
    ) {
      newErrors.push("Todos los campos son requeridos")
    }

    // Validar valores numéricos
    if (Number.parseInt(formData.cantidadVacantes) <= 0) {
      newErrors.push("La cantidad de vacantes debe ser mayor a 0")
    }

    if (Number.parseInt(formData.horasDedicadas) <= 0) {
      newErrors.push("Las horas dedicadas deben ser mayor a 0")
    }

    if (Number.parseInt(formData.cantidadSuPostulaciones) < 0) {
      newErrors.push("La cantidad de postulaciones no puede ser negativa")
    }

    // Simular búsqueda de puesto no encontrado
    if (formData.codPuesto === "P1111") {
      newErrors.push("No se encontró el puesto con el código ingresado")
    }

    // Verificar que no exista ya en el proyecto
    const puestoExistente = existingPuestos.find((p) => p.puesto.codPuesto === formData.codPuesto)
    if (puestoExistente) {
      newErrors.push("Ya existe un puesto con este código en el proyecto")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const puestoData: ProyectoPuesto = {
        codPP: 0,
        cantidadVacantes: Number.parseInt(formData.cantidadVacantes),
        cantidadSuPostulaciones: Number.parseInt(formData.cantidadSuPostulaciones),
        horasDedicadas: Number.parseInt(formData.horasDedicadas),
        puesto: {
          codPuesto: formData.codPuesto,
          nombrePuesto: `Puesto ${formData.codPuesto}`,
        },
      }
      onSave(puestoData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Header - sin fondo blanco */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and title */}
        <div className="mb-8">
          <Button variant="outline" onClick={onCancel} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Datos requeridos para el alta del puesto</h2>
            <p className="text-gray-600 mt-1">Ingrese los siguientes datos:</p>
          </div>
        </div>

        {/* Form Card - cuadro blanco restaurado */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Puesto</CardTitle>
            <CardDescription>Complete los campos requeridos para dar alta el puesto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cantidadSuPostulaciones">
                  Cantidad Máxima Postulaciones <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cantidadSuPostulaciones"
                  type="text"
                  placeholder="Ingresar cantidad máxima de postulaciones"
                  value={formData.cantidadSuPostulaciones}
                  onChange={(e) => setFormData({ ...formData, cantidadSuPostulaciones: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cantidadVacantes">
                  Cantidad Vacantes <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cantidadVacantes"
                  type="text"
                  placeholder="Ingresar cantidad de vacantes"
                  value={formData.cantidadVacantes}
                  onChange={(e) => setFormData({ ...formData, cantidadVacantes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horasDedicadas">
                  Horas Dedicadas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="horasDedicadas"
                  type="text"
                  placeholder="Ingresar horas dedicadas"
                  value={formData.horasDedicadas}
                  onChange={(e) => setFormData({ ...formData, horasDedicadas: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codPuesto">
                  Código Puesto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codPuesto"
                  type="text"
                  placeholder="Ingresar código del puesto"
                  value={formData.codPuesto}
                  onChange={(e) => setFormData({ ...formData, codPuesto: e.target.value })}
                />
              </div>
            </div>

            {/* Error messages - same style as Crear Nuevo Proyecto */}
            {errors.length > 0 && (
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm text-red-800">{error}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons - centered and above info box */}
            <div className="flex justify-center space-x-4 pt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                <Plus className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
            </div>

            {/* Ejemplos para prueba */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-bold text-blue-800 mb-2">Ejemplos para prueba:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ingrese datos válidos para simular la creación de un puesto.</li>
                <li>• Ingrese datos incompletos para simular datos no válidos.</li>
                <li>• Ingrese "P1111" como código para simular puesto no encontrado.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
