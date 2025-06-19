"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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
  carreras: any[]
}

interface PuestoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  puesto?: ProyectoPuesto | null
  onSave: (puesto: ProyectoPuesto) => void
}

const mockPuestos = [
  { codPuesto: "DEV001", nombrePuesto: "Desarrollador Full Stack" },
  { codPuesto: "DEV002", nombrePuesto: "Desarrollador Frontend" },
  { codPuesto: "DEV003", nombrePuesto: "Desarrollador Backend" },
  { codPuesto: "DES001", nombrePuesto: "Diseñador UX/UI" },
  { codPuesto: "QA001", nombrePuesto: "Tester QA" },
  { codPuesto: "PM001", nombrePuesto: "Project Manager" },
]

export function PuestoForm({ open, onOpenChange, mode, puesto, onSave }: PuestoFormProps) {
  const [formData, setFormData] = useState({
    cantidadVacantes: 1,
    cantidadSuPostulaciones: 0,
    horasDedicadas: 20,
    codPuesto: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (puesto && mode === "edit") {
      setFormData({
        cantidadVacantes: puesto.cantidadVacantes,
        cantidadSuPostulaciones: puesto.cantidadSuPostulaciones,
        horasDedicadas: puesto.horasDedicadas,
        codPuesto: puesto.puesto.codPuesto,
      })
    } else {
      setFormData({
        cantidadVacantes: 1,
        cantidadSuPostulaciones: 0,
        horasDedicadas: 20,
        codPuesto: "",
      })
    }
    setErrors([])
    setShowConfirmation(false)
  }, [puesto, mode, open])

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.codPuesto) {
      newErrors.push("Debe seleccionar un puesto")
    }

    if (formData.cantidadVacantes <= 0) {
      newErrors.push("La cantidad de vacantes debe ser mayor a 0")
    }

    if (formData.horasDedicadas <= 0) {
      newErrors.push("Las horas dedicadas deben ser mayor a 0")
    }

    if (formData.cantidadSuPostulaciones < 0) {
      newErrors.push("La cantidad de postulaciones no puede ser negativa")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true)
    }
  }

  const handleConfirm = () => {
    const selectedPuesto = mockPuestos.find((p) => p.codPuesto === formData.codPuesto)

    const puestoData: ProyectoPuesto = {
      codPP: puesto?.codPP || 0,
      cantidadVacantes: formData.cantidadVacantes,
      cantidadSuPostulaciones: formData.cantidadSuPostulaciones,
      horasDedicadas: formData.horasDedicadas,
      puesto: {
        codPuesto: formData.codPuesto,
        nombrePuesto: selectedPuesto?.nombrePuesto || "",
      },
      carreras: puesto?.carreras || [],
    }

    onSave(puestoData)
  }

  if (showConfirmation) {
    const selectedPuesto = mockPuestos.find((p) => p.codPuesto === formData.codPuesto)

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar {mode === "create" ? "Creación" : "Modificación"}</DialogTitle>
            {/* Sistema title */}
            <div className="text-center mb-4 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
            </div>
            <DialogDescription>
              ¿Está seguro que desea {mode === "create" ? "crear" : "modificar"} el puesto "
              {selectedPuesto?.nombrePuesto}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Agregar Puesto" : "Modificar Puesto"}</DialogTitle>
          {/* Sistema title */}
          <div className="text-center mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
          </div>
          <DialogDescription>
            {mode === "create"
              ? "Ingrese los datos del nuevo puesto para el proyecto"
              : "Modifique los datos del puesto seleccionado"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="codPuesto">Puesto *</Label>
            <Select
              value={formData.codPuesto}
              onValueChange={(value) => setFormData({ ...formData, codPuesto: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un puesto" />
              </SelectTrigger>
              <SelectContent>
                {mockPuestos.map((puesto) => (
                  <SelectItem key={puesto.codPuesto} value={puesto.codPuesto}>
                    {puesto.nombrePuesto} ({puesto.codPuesto})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cantidadVacantes">Cantidad de Vacantes *</Label>
              <Input
                id="cantidadVacantes"
                type="number"
                min="1"
                value={formData.cantidadVacantes}
                onChange={(e) => setFormData({ ...formData, cantidadVacantes: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horasDedicadas">Horas Semanales *</Label>
              <Input
                id="horasDedicadas"
                type="number"
                min="1"
                max="40"
                value={formData.horasDedicadas}
                onChange={(e) => setFormData({ ...formData, horasDedicadas: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidadSuPostulaciones">Postulaciones Actuales</Label>
            <Input
              id="cantidadSuPostulaciones"
              type="number"
              min="0"
              value={formData.cantidadSuPostulaciones}
              onChange={(e) =>
                setFormData({ ...formData, cantidadSuPostulaciones: Number.parseInt(e.target.value) || 0 })
              }
              disabled={mode === "create"}
            />
            {mode === "create" && (
              <p className="text-xs text-muted-foreground">
                Este valor se actualizará automáticamente cuando se reciban postulaciones
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{mode === "create" ? "Crear Puesto" : "Guardar Cambios"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
