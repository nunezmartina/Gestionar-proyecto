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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Briefcase, AlertCircle } from "lucide-react"
import { AltaProyectoPuesto } from "./alta-proyecto-puesto"

interface Proyecto {
  numeroProyecto: number
  nombreProyecto: string
  descripcionProyecto: string
  fechaInicioPostulaciones?: string | null
  fechaCierrePostulaciones: string
  fechaInicioActividades: string
  fechaFinProyecto: string
  nombreEmpresa: string
  nombreUniversidad: string
  nombreEstadoProyecto: string
  codEstadoProyecto: string
}

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

interface ProyectoPuestoManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proyecto: Proyecto | null
}

const mockProyectoPuestos: ProyectoPuesto[] = [
  {
    codPP: 1,
    cantidadVacantes: 2,
    cantidadSuPostulaciones: 5,
    horasDedicadas: 20,
    fechaBajaProyectoPuesto: "2025-06-15",
    puesto: {
      codPuesto: "P0001",
      nombrePuesto: "Desarrollador Full Stack",
    },
  },
  {
    codPP: 2,
    cantidadVacantes: 1,
    cantidadSuPostulaciones: 3,
    horasDedicadas: 15,
    puesto: {
      codPuesto: "P0004",
      nombrePuesto: "Diseñador UX/UI",
    },
  },
]

export function ProyectoPuestoManagementDialog({ open, onOpenChange, proyecto }: ProyectoPuestoManagementDialogProps) {
  const [proyectoPuestos, setProyectoPuestos] = useState<ProyectoPuesto[]>(mockProyectoPuestos)
  const [selectedPuesto, setSelectedPuesto] = useState<ProyectoPuesto | null>(null)
  const [action, setAction] = useState<"alta" | "modificacion" | "baja" | null>(null)
  const [showActionSelector, setShowActionSelector] = useState(false)
  const [showAltaConfirmation, setShowAltaConfirmation] = useState(false)
  const [showRequisitosConfirmation, setShowRequisitosConfirmation] = useState(false)
  const [showAltaProyectoPuesto, setShowAltaProyectoPuesto] = useState(false)
  const [pendingPuesto, setPendingPuesto] = useState<ProyectoPuesto | null>(null)

  const handleSaveAltaPuesto = (puestoData: ProyectoPuesto) => {
    const newPuesto = {
      ...puestoData,
      codPP: proyectoPuestos.length + 1,
    }
    setPendingPuesto(newPuesto)
    setShowAltaProyectoPuesto(false)
    setShowAltaConfirmation(true)
  }

  const handleCancelAltaPuesto = () => {
    setShowAltaProyectoPuesto(false)
    setAction(null)
    setSelectedPuesto(null)
    // Reopen the main dialog
    onOpenChange(true)
  }

  useEffect(() => {
    if (!open) {
      resetAllStates()
    }
  }, [open])

  const resetAllStates = () => {
    setSelectedPuesto(null)
    setAction(null)
    setShowActionSelector(false)
    setShowAltaConfirmation(false)
    setShowRequisitosConfirmation(false)
    setShowAltaProyectoPuesto(false)
    setPendingPuesto(null)
  }

  const handleAltaPuesto = () => {
    setAction("alta")
    setSelectedPuesto(null)
    // Close the dialog and show the full-page component
    onOpenChange(false)
    setShowAltaProyectoPuesto(true)
  }

  const handleSelectPuesto = (puesto: ProyectoPuesto) => {
    setSelectedPuesto(puesto)
    setShowActionSelector(true)
  }

  const handleSelectAction = (selectedAction: "alta" | "modificacion" | "baja") => {
    setAction(selectedAction)
    setShowActionSelector(false)

    if (selectedAction === "alta") {
      setSelectedPuesto(null)
      // Close the dialog and show the full-page component
      onOpenChange(false)
      setShowAltaProyectoPuesto(true)
    } else if (selectedAction === "modificacion" && selectedPuesto) {
      console.log("Modificación de puesto")
    } else if (selectedAction === "baja" && selectedPuesto) {
      handleBajaPuesto()
    }
  }

  const handleBajaPuesto = () => {
    if (selectedPuesto) {
      if (confirm(`¿Está seguro que desea dar de baja el puesto "${selectedPuesto.puesto.nombrePuesto}"?`)) {
        setProyectoPuestos(proyectoPuestos.filter((p) => p.codPP !== selectedPuesto.codPP))
        setSelectedPuesto(null)
        setAction(null)
      }
    }
  }

  const handleConfirmAlta = () => {
    if (pendingPuesto) {
      setProyectoPuestos([...proyectoPuestos, pendingPuesto])
      setShowAltaConfirmation(false)
      setShowRequisitosConfirmation(true)
    }
  }

  const handleConfirmRequisitos = () => {
    setShowRequisitosConfirmation(false)
    resetAllStates()
    console.log("Puesto creado exitosamente y listo para agregar requisitos")
  }

  // Confirmación de requisitos
  if (showRequisitosConfirmation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="text-center mb-4 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
            </div>
            <DialogTitle>Requisitos del Puesto</DialogTitle>
            <DialogDescription>Ahora debe continuar con la creación de los requisitos del puesto.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRequisitosConfirmation(false)
                resetAllStates()
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmRequisitos}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Confirmación del alta
  if (showAltaConfirmation && pendingPuesto) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="text-center mb-4 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
            </div>
            <DialogTitle>Confirmar Creación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea crear el puesto con los siguientes datos?
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Código Puesto:</strong> {pendingPuesto.puesto.codPuesto}
                  </div>
                  <div>
                    <strong>Cantidad Vacantes:</strong> {pendingPuesto.cantidadVacantes}
                  </div>
                  <div>
                    <strong>Horas Dedicadas:</strong> {pendingPuesto.horasDedicadas}
                  </div>
                  <div>
                    <strong>Cantidad Máxima Postulaciones:</strong> {pendingPuesto.cantidadSuPostulaciones}
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAltaConfirmation(false)
                setShowAltaProyectoPuesto(true)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmAlta}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Selector de acción
  if (showActionSelector && selectedPuesto) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="text-center mb-4 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
            </div>
            <DialogTitle>Seleccionar Acción</DialogTitle>
            <DialogDescription>
              Ingrese selección a realizar con el puesto: {selectedPuesto.puesto.nombrePuesto}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => handleSelectAction("alta")}>
                <Plus className="h-4 w-4 mr-2" />
                Alta - Agregar nuevo puesto
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => handleSelectAction("modificacion")}>
                <Edit className="h-4 w-4 mr-2" />
                Modificación - Editar puesto seleccionado
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => handleSelectAction("baja")}>
                <Trash2 className="h-4 w-4 mr-2" />
                Baja - Eliminar puesto seleccionado
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowActionSelector(false)
                setSelectedPuesto(null)
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Pantalla principal de gestión
  if (showAltaProyectoPuesto) {
    return (
      <AltaProyectoPuesto
        onSave={handleSaveAltaPuesto}
        onCancel={handleCancelAltaPuesto}
        existingPuestos={proyectoPuestos}
      />
    )
  }

  if (!proyecto) return null

  const canManage = proyecto.nombreEstadoProyecto === "Creado"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center mb-4 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h2>
          </div>
          <DialogTitle>Gestión de Proyecto-Puesto</DialogTitle>
          <DialogDescription>
            {proyecto.nombreProyecto}
            <br />
            <span className="text-sm text-muted-foreground">
              Proyecto #{proyecto.numeroProyecto.toString().padStart(5, "0")}
            </span>
            {!canManage && (
              <Badge variant="outline" className="ml-2">
                Solo lectura - Estado: {proyecto.nombreEstadoProyecto}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!canManage && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Solo se pueden gestionar puestos en proyectos con estado "Creado"</AlertDescription>
            </Alert>
          )}

          {canManage && proyectoPuestos.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Haga clic en un puesto para seleccionar la acción a realizar (Alta-Modificación-Baja)
              </AlertDescription>
            </Alert>
          )}

          {proyectoPuestos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay puestos definidos</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Agregue puestos para completar la configuración del proyecto
                </p>
                {canManage && (
                  <Button onClick={handleAltaPuesto}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primer Puesto
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {proyectoPuestos.map((puesto) => (
                <Card
                  key={puesto.codPP}
                  className={`cursor-pointer transition-colors ${canManage ? "hover:bg-muted/50" : ""}`}
                  onClick={() => canManage && handleSelectPuesto(puesto)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {puesto.puesto.nombrePuesto}
                          <Badge variant="outline">{puesto.puesto.codPuesto}</Badge>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Cantidad Vacantes:</span>
                        <p className="text-muted-foreground">{puesto.cantidadVacantes}</p>
                      </div>
                      <div>
                        <span className="font-medium">Cantidad Máxima de Postulaciones:</span>
                        <p className="text-muted-foreground">{puesto.cantidadSuPostulaciones}</p>
                      </div>
                      <div>
                        <span className="font-medium">Horas Dedicadas:</span>
                        <p className="text-muted-foreground">{puesto.horasDedicadas}</p>
                      </div>
                      <div>
                        <span className="font-medium">Fecha de Baja:</span>
                        <p className="text-muted-foreground">{puesto.fechaBajaProyectoPuesto || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
