"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit, Play, Pause, Square, CheckCircle, Users, Settings } from "lucide-react"
import { EstadoProyectoDialog } from "@/components/estado-proyecto-dialog"
import { ProyectoPuestoDialog } from "@/components/proyecto-puesto-dialog"
import { PreviewDialog } from "@/components/preview-dialog"

interface Proyecto {
  numeroProyecto: number
  nombreProyecto: string
  descripcionProyecto: string
  fechaInicioPostulaciones?: string
  fechaCierrePostulaciones: string
  fechaInicioActividades: string
  fechaFinProyecto: string
  nombreEmpresa: string
  nombreUniversidad: string
  nombreEstadoProyecto: string
  codEstadoProyecto: string
}

const mockProyectos: Proyecto[] = [
  {
    numeroProyecto: 1,
    nombreProyecto: "Sistema de Gestión Académica",
    descripcionProyecto: "Desarrollo de sistema para gestión de estudiantes y materias",
    fechaInicioPostulaciones: "2025-01-15",
    fechaCierrePostulaciones: "2025-02-15",
    fechaInicioActividades: "2025-03-01",
    fechaFinProyecto: "2025-12-15",
    nombreEmpresa: "TechCorp SA",
    nombreUniversidad: "Universidad Nacional",
    nombreEstadoProyecto: "Iniciado",
    codEstadoProyecto: "EST001",
  },
  {
    numeroProyecto: 2,
    nombreProyecto: "App Mobile E-commerce",
    descripcionProyecto: "Aplicación móvil para comercio electrónico",
    fechaInicioPostulaciones: "2025-02-15",
    fechaCierrePostulaciones: "2025-03-01",
    fechaInicioActividades: "2025-04-01",
    fechaFinProyecto: "2025-11-30",
    nombreEmpresa: "Digital Solutions",
    nombreUniversidad: "Universidad Tecnológica",
    nombreEstadoProyecto: "Creado",
    codEstadoProyecto: "EST002",
  },
  {
    numeroProyecto: 3,
    nombreProyecto: "Plataforma de Análisis de Datos",
    descripcionProyecto: "Sistema de análisis y visualización de datos empresariales",
    fechaInicioPostulaciones: "2025-02-01",
    fechaCierrePostulaciones: "2025-02-28",
    fechaInicioActividades: "2025-03-15",
    fechaFinProyecto: "2025-10-30",
    nombreEmpresa: "DataTech Inc",
    nombreUniversidad: "Universidad de Ingeniería",
    nombreEstadoProyecto: "En evaluación",
    codEstadoProyecto: "EST003",
  },
]

const getEstadoBadgeVariant = (estado: string) => {
  switch (estado) {
    case "Creado":
      return "default"
    case "Iniciado":
      return "default"
    case "En evaluación":
      return "default"
    case "Suspendido":
      return "destructive"
    case "Finalizado":
      return "default"
    case "Cancelado":
      return "destructive"
    default:
      return "secondary"
  }
}

const getEstadoBadgeClass = (estado: string) => {
  switch (estado) {
    case "Creado":
      return "bg-green-500 hover:bg-green-600 text-white"
    case "Iniciado":
      return "bg-yellow-500 hover:bg-yellow-600 text-white"
    case "En evaluación":
      return "bg-orange-500 hover:bg-orange-600 text-white"
    default:
      return ""
  }
}

const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case "Creado":
      return <Plus className="h-4 w-4 mr-1" />
    case "Iniciado":
      return <Play className="h-4 w-4 mr-1" />
    case "En evaluación":
      return <Eye className="h-4 w-4 mr-1" />
    case "Suspendido":
      return <Pause className="h-4 w-4 mr-1" />
    case "Finalizado":
      return <CheckCircle className="h-4 w-4 mr-1" />
    case "Cancelado":
      return <Square className="h-4 w-4 mr-1" />
    default:
      return <Plus className="h-4 w-4 mr-1" />
  }
}

export default function GestionarProyectos() {
  const router = useRouter()
  const [proyectos, setProyectos] = useState<Proyecto[]>(mockProyectos)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null)
  const [showEstadoDialog, setShowEstadoDialog] = useState(false)
  const [showPuestoDialog, setShowPuestoDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const filteredProyectos = proyectos.filter(
    (proyecto) =>
      proyecto.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.nombreUniversidad.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateProject = () => {
    router.push("/crear-proyecto")
  }

  const handleEditProject = (proyecto: Proyecto) => {
    // Aquí podrías navegar a una página de edición
    console.log("Editar proyecto:", proyecto)
  }

  const handleChangeEstado = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto)
    setShowEstadoDialog(true)
  }

  const handleManagePuestos = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto)
    setShowPuestoDialog(true)
  }

  const handlePreview = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto)
    setShowPreview(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Sistema title - appears on all screens */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* The rest of the content remains the same */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
            <p className="text-muted-foreground">Administra proyectos de prácticas profesionales</p>
          </div>
          <Button onClick={handleCreateProject} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Proyecto
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredProyectos.map((proyecto) => (
            <Card key={proyecto.numeroProyecto} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">{proyecto.nombreProyecto}</CardTitle>
                    <CardDescription>
                      Proyecto #{proyecto.numeroProyecto.toString().padStart(5, "0")} • {proyecto.nombreEmpresa} •{" "}
                      {proyecto.nombreUniversidad}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(proyecto)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(proyecto)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar proyecto</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleChangeEstado(proyecto)}>
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Cambiar estado</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleManagePuestos(proyecto)}>
                      <Users className="h-4 w-4 mr-1" />
                      Puestos
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{proyecto.descripcionProyecto}</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Inicio actividades:</span>
                    <p className="text-muted-foreground">{proyecto.fechaInicioActividades}</p>
                  </div>
                  <div>
                    <span className="font-medium">Fin proyecto:</span>
                    <p className="text-muted-foreground">{proyecto.fechaFinProyecto}</p>
                  </div>
                  {proyecto.fechaInicioPostulaciones && (
                    <div>
                      <span className="font-medium">Inicio postulaciones:</span>
                      <p className="text-muted-foreground">{proyecto.fechaInicioPostulaciones}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Estado:</span>
                    <div className="mt-1">
                      <Badge
                        variant={getEstadoBadgeVariant(proyecto.nombreEstadoProyecto)}
                        className={getEstadoBadgeClass(proyecto.nombreEstadoProyecto)}
                      >
                        {getEstadoIcon(proyecto.nombreEstadoProyecto)}
                        {proyecto.nombreEstadoProyecto}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Código Estado:</span>
                    <p className="text-muted-foreground">{proyecto.codEstadoProyecto}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProyectos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron proyectos</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primer proyecto"}
              </p>
            </CardContent>
          </Card>
        )}

        <EstadoProyectoDialog
          open={showEstadoDialog}
          onOpenChange={setShowEstadoDialog}
          proyecto={selectedProyecto}
          onSave={(proyecto) => {
            setProyectos(proyectos.map((p) => (p.numeroProyecto === proyecto.numeroProyecto ? proyecto : p)))
            setShowEstadoDialog(false)
          }}
        />

        <ProyectoPuestoDialog open={showPuestoDialog} onOpenChange={setShowPuestoDialog} proyecto={selectedProyecto} />

        <PreviewDialog open={showPreview} onOpenChange={setShowPreview} proyecto={selectedProyecto} />
      </div>
    </div>
  )
}
