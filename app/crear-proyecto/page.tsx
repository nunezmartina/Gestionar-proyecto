"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  X,
  Building,
  GraduationCap,
  Calendar,
  UserPlus,
  Plus,
  AlertTriangle,
  User,
  Clock,
  Users,
} from "lucide-react"

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

// Mock data para empresas y universidades con sus CUITs
const mockEmpresas = [
  { cuit: "20-12345678-9", nombre: "TechCorp SA" },
  { cuit: "20-87654321-0", nombre: "Digital Solutions" },
  { cuit: "20-11111111-1", nombre: "DataTech Inc" },
  { cuit: "20-22222222-2", nombre: "Innovation Labs" },
  { cuit: "20-33333333-3", nombre: "Software Factory" },
]

const mockUniversidades = [
  { cuit: "30-12345678-9", nombre: "Universidad Nacional" },
  { cuit: "30-87654321-0", nombre: "Universidad Tecnológica" },
  { cuit: "30-11111111-1", nombre: "Universidad de Ingeniería" },
  { cuit: "30-22222222-2", nombre: "Universidad del Sur" },
  { cuit: "30-33333333-3", nombre: "Universidad Privada" },
]

const mockProyectosExistentes: Proyecto[] = [
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
    nombreProyecto: "TCodeNova",
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
]

export default function CrearProyecto() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombreProyecto: "",
    descripcionProyecto: "",
    fechaCierrePostulaciones: "",
    fechaInicioActividades: "",
    fechaFinProyecto: "",
    cuitEmpresa: "",
    cuitUniversidad: "",
  })
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [generalErrors, setGeneralErrors] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showProjectSummary, setShowProjectSummary] = useState(false)
  const [showPositionManagement, setShowPositionManagement] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPositionConfirmation, setShowPositionConfirmation] = useState(false)
  const [showPuestoForm, setShowPuestoForm] = useState(false)
  const [puestoFormData, setPuestoFormData] = useState({
    cantidadSuPostulaciones: 0,
    cantidadVacantes: 1,
    horasDedicadas: 20,
    codPuesto: "",
  })
  const [puestoFieldErrors, setPuestoFieldErrors] = useState<{ [key: string]: string }>({})
  const [puestoGeneralErrors, setPuestoGeneralErrors] = useState<string[]>([])
  const [showPuestoConfirmation, setShowPuestoConfirmation] = useState(false)
  const [showPuestoSummary, setShowPuestoSummary] = useState(false)
  const [showRequisitosConfirmation, setShowRequisitosConfirmation] = useState(false)

  const validateCUIT = (cuit: string) => {
    // Validar formato CUIT: XX-XXXXXXXX-X
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/
    return cuitRegex.test(cuit)
  }

  const formatCUIT = (value: string) => {
    // Remover todo lo que no sea número
    const numbers = value.replace(/\D/g, "")

    // Aplicar formato XX-XXXXXXXX-X
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`
    } else {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`
    }
  }

  const validateForm = () => {
    const newGeneralErrors: string[] = []
    const newFieldErrors: { [key: string]: string } = {}

    // 1. Validar campos obligatorios vacíos o mal formateados
    if (
      !formData.nombreProyecto.trim() ||
      !formData.descripcionProyecto.trim() ||
      !formData.fechaCierrePostulaciones ||
      !formData.fechaInicioActividades ||
      !formData.fechaFinProyecto ||
      !formData.cuitEmpresa.trim() ||
      !formData.cuitUniversidad.trim() ||
      !validateCUIT(formData.cuitEmpresa) ||
      !validateCUIT(formData.cuitUniversidad)
    ) {
      newGeneralErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      setGeneralErrors(newGeneralErrors)
      setFieldErrors({})
      return false
    }

    // 2. Validar casos específicos y asignar errores a campos específicos

    // CUIT empresa específico
    if (formData.cuitEmpresa === "20-12345678-9") {
      newFieldErrors.cuitEmpresa = "La empresa para la que ingresó el código no existe. Intente nuevamente."
    }

    // CUIT universidad específico
    if (formData.cuitUniversidad === "20-12345678-1") {
      newFieldErrors.cuitUniversidad = "La universidad para la que ingresó el código no existe. Intente nuevamente."
    }

    // Nombre de proyecto específico
    if (formData.nombreProyecto === "TCodeNova") {
      newFieldErrors.nombreProyecto = "El nombre del proyecto ya está en uso. Intente con un nombre distinto"
    }

    // Validar fechas - SIEMPRE verificar que cierre sea menor que inicio de actividades
    if (formData.fechaCierrePostulaciones && formData.fechaInicioActividades) {
      const fechaCierre = new Date(formData.fechaCierrePostulaciones)
      const fechaInicio = new Date(formData.fechaInicioActividades)

      if (fechaCierre >= fechaInicio) {
        newFieldErrors.fechaCierrePostulaciones =
          "La fecha de cierre de postulaciones debe ser menor a la fecha de inicio del proyecto."
      }
    }

    // Validaciones adicionales solo si no hay errores específicos
    if (Object.keys(newFieldErrors).length === 0) {
      // Validar nombre de proyecto duplicado (para otros nombres)
      const nombreDuplicado = mockProyectosExistentes.some(
        (p) => p.nombreProyecto.toLowerCase() === formData.nombreProyecto.toLowerCase(),
      )
      if (nombreDuplicado) {
        newFieldErrors.nombreProyecto = "El nombre del proyecto ya está en uso. Intente con un nombre distinto"
      }

      // Validar fecha fin proyecto
      if (formData.fechaInicioActividades && formData.fechaFinProyecto) {
        const fechaInicio = new Date(formData.fechaInicioActividades)
        const fechaFin = new Date(formData.fechaFinProyecto)

        if (fechaInicio >= fechaFin) {
          newGeneralErrors.push("La fecha de fin del proyecto debe ser mayor a la fecha de inicio de actividades.")
        }
      }
    }

    setFieldErrors(newFieldErrors)
    setGeneralErrors(newGeneralErrors)
    return Object.keys(newFieldErrors).length === 0 && newGeneralErrors.length === 0
  }

  const validatePuestoForm = () => {
    const newGeneralErrors: string[] = []
    const newFieldErrors: { [key: string]: string } = {}

    // 1. Validar campos obligatorios vacíos
    if (
      !puestoFormData.codPuesto.trim() ||
      puestoFormData.cantidadVacantes <= 0 ||
      puestoFormData.horasDedicadas <= 0
    ) {
      newGeneralErrors.push("Los datos ingresados son incorrectos. Intente nuevamente")
      setPuestoGeneralErrors(newGeneralErrors)
      setPuestoFieldErrors({})
      return false
    }

    // 2. Validar código de puesto específico
    if (puestoFormData.codPuesto === "0001") {
      newFieldErrors.codPuesto = "El puesto buscado con el código ingresado incorrecto."
    }

    setPuestoFieldErrors(newFieldErrors)
    setPuestoGeneralErrors(newGeneralErrors)
    return Object.keys(newFieldErrors).length === 0 && newGeneralErrors.length === 0
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (validateForm()) {
      setShowConfirmation(true) // Show confirmation first instead of summary
    }
    setIsSubmitting(false)
  }

  const handlePuestoSubmit = () => {
    if (validatePuestoForm()) {
      setShowPuestoForm(false) // Ocultar el formulario
      setShowPuestoConfirmation(true) // Mostrar confirmación
    }
  }

  const handleConfirm = () => {
    setShowConfirmation(false)
    setShowProjectSummary(true) // Show summary after confirmation
  }

  const handleFinalConfirm = () => {
    // Aquí normalmente guardarías el proyecto
    console.log("Proyecto creado:", formData)
    router.push("/")
  }

  const handleCancel = () => {
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEmpresaNombre = () => {
    const empresa = mockEmpresas.find((e) => e.cuit === formData.cuitEmpresa)
    return empresa ? empresa.nombre : "Nombre Empresa"
  }

  const getUniversidadNombre = () => {
    const universidad = mockUniversidades.find((u) => u.cuit === formData.cuitUniversidad)
    return universidad ? universidad.nombre : "Nombre Universidad"
  }

  const handleCuitChange = (value: string, field: "cuitEmpresa" | "cuitUniversidad") => {
    const formattedValue = formatCUIT(value)
    setFormData({ ...formData, [field]: formattedValue })

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
  }

  const handlePuestoInputChange = (field: string, value: string | number) => {
    setPuestoFormData({ ...puestoFormData, [field]: value })

    // Limpiar errores cuando el usuario empiece a escribir
    if (puestoFieldErrors[field]) {
      setPuestoFieldErrors({ ...puestoFieldErrors, [field]: "" })
    }
    if (puestoGeneralErrors.length > 0) {
      setPuestoGeneralErrors([])
    }
  }

  // Función para manejar el focus en campos con errores
  const handleFieldFocus = (field: string) => {
    // Si el campo tiene error, limpiar su contenido cuando se hace focus
    if (fieldErrors[field]) {
      setFormData({ ...formData, [field]: "" })
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
  }

  // Función específica para campos CUIT con focus
  const handleCuitFocus = (field: "cuitEmpresa" | "cuitUniversidad") => {
    // Si el campo tiene error, limpiar su contenido cuando se hace focus
    if (fieldErrors[field]) {
      setFormData({ ...formData, [field]: "" })
      setFieldErrors({ ...fieldErrors, [field]: "" })
    }
  }

  const handleConfirmPuesto = () => {
    setShowPuestoConfirmation(false)
    setShowPuestoSummary(true) // Mostrar resumen del puesto
  }

  const handleContinuarPuesto = () => {
    setShowPuestoSummary(false)
    setShowRequisitosConfirmation(true) // Mostrar pantalla de requisitos
  }

  const handleConfirmarRequisitos = () => {
    console.log("Proyecto y puesto creados:", { formData, puestoFormData })
    router.push("/")
  }

  // Pantalla de resumen del proyecto
  if (showProjectSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Proyecto</CardTitle>
              <CardDescription>Revise los datos del proyecto antes de la creación final</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información del proyecto */}
              <div className="bg-white border rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{formData.nombreProyecto}</h3>
                  <p className="text-sm text-gray-500">Proyecto de Prácticas Profesionales</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Descripción</h4>
                  <p className="text-gray-600 leading-relaxed">{formData.descripcionProyecto}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-700">Empresa</p>
                      <p className="text-sm text-gray-600">{getEmpresaNombre()}</p>
                      <p className="text-xs text-gray-500">CUIT: {formData.cuitEmpresa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-700">Universidad</p>
                      <p className="text-sm text-gray-600">{getUniversidadNombre()}</p>
                      <p className="text-xs text-gray-500">CUIT: {formData.cuitUniversidad}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cronograma
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Cierre Postulaciones</p>
                      <p className="text-sm text-gray-600">{formatDate(formData.fechaCierrePostulaciones)}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Inicio Actividades</p>
                      <p className="text-sm text-gray-600">{formatDate(formData.fechaInicioActividades)}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Fin Proyecto</p>
                      <p className="text-sm text-gray-600">{formatDate(formData.fechaFinProyecto)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Continuar */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => {
                    setShowProjectSummary(false)
                    setShowPositionConfirmation(true) // Show position confirmation after summary
                  }}
                  size="lg"
                  className="px-8"
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Confirmar Creación</CardTitle>
              <CardDescription>¿Está seguro que desea crear el proyecto "{formData.nombreProyecto}"?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirm}>Confirmar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showPositionConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Finalizar Creación del Proyecto</CardTitle>
              <CardDescription>
                Usted debe dar de alta un puesto y sus requisitos para finalizar la creación del proyecto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setShowPositionConfirmation(false)
                    setShowPuestoForm(true) // Mostrar formulario de puesto
                  }}
                >
                  Confirmar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showPuestoForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Dar Alta Puesto</h1>
                <p className="text-muted-foreground">Ingrese los datos para dar alta a un puesto</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Puesto</CardTitle>
              <CardDescription>Complete los campos requeridos para dar alta el puesto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error general */}
              {puestoGeneralErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm text-red-800">
                        {puestoGeneralErrors.map((error, index) => (
                          <div key={index} className="mb-1 last:mb-0">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codPuesto">
                    Código Puesto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="codPuesto"
                    value={puestoFormData.codPuesto}
                    onChange={(e) => handlePuestoInputChange("codPuesto", e.target.value)}
                    placeholder="Ingrese el código del puesto"
                    className="h-12"
                  />
                  {/* Error específico del código de puesto */}
                  {puestoFieldErrors.codPuesto && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        </div>
                        <div className="ml-2">
                          <div className="text-sm text-red-800">{puestoFieldErrors.codPuesto}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cantidadVacantes">
                    Cantidad Vacantes <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cantidadVacantes"
                    type="number"
                    min="1"
                    value={puestoFormData.cantidadVacantes}
                    onChange={(e) => handlePuestoInputChange("cantidadVacantes", Number.parseInt(e.target.value) || 1)}
                    placeholder="Número de vacantes"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="horasDedicadas">
                    Horas Dedicadas <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="horasDedicadas"
                    type="number"
                    min="1"
                    max="40"
                    value={puestoFormData.horasDedicadas}
                    onChange={(e) => handlePuestoInputChange("horasDedicadas", Number.parseInt(e.target.value) || 20)}
                    placeholder="Horas semanales"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cantidadSuPostulaciones">Cantidad Su Postulaciones</Label>
                  <Input
                    id="cantidadSuPostulaciones"
                    type="number"
                    min="0"
                    value={puestoFormData.cantidadSuPostulaciones}
                    onChange={(e) =>
                      handlePuestoInputChange("cantidadSuPostulaciones", Number.parseInt(e.target.value) || 0)
                    }
                    placeholder="Número de postulaciones"
                    className="h-12"
                  />
                </div>
              </div>
            </CardContent>

            {/* Ejemplos para prueba */}
            <CardContent className="pt-0">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    <strong>Ejemplos para prueba:</strong>
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese cualquier datos válidos para simular la alta de un puesto.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese "0001" para simular que ese puesto no se encuentra.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ingrese datos incompletos para simular datos no válidos.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-end mt-8">
            <Button variant="outline" onClick={() => router.push("/")} size="lg">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handlePuestoSubmit} size="lg">
              <UserPlus className="h-4 w-4 mr-2" />
              Dar Alta Puesto
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showPuestoConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-2xl">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Confirmar Alta</CardTitle>
              <CardDescription>¿Está seguro de dar alta el puesto?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPuestoConfirmation(false)
                    setShowPuestoForm(true) // Volver al formulario
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleConfirmPuesto}>Confirmar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Nueva pantalla de resumen del puesto
  if (showPuestoSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Puesto</CardTitle>
              <CardDescription>Revise los datos del puesto que acaba de dar de alta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información del puesto */}
              <div className="bg-white border rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Puesto Dado de Alta</h3>
                  <p className="text-sm text-gray-500">Código: {puestoFormData.codPuesto}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-700">Código del Puesto</p>
                      <p className="text-sm text-gray-600">{puestoFormData.codPuesto}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-700">Cantidad de Vacantes</p>
                      <p className="text-sm text-gray-600">{puestoFormData.cantidadVacantes}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-700">Horas Dedicadas</p>
                      <p className="text-sm text-gray-600">{puestoFormData.horasDedicadas} horas semanales</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <UserPlus className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-700">Postulaciones Actuales</p>
                      <p className="text-sm text-gray-600">{puestoFormData.cantidadSuPostulaciones}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">El puesto ha sido dado de alta exitosamente</p>
                      <p className="text-sm text-green-700">
                        El puesto con código "{puestoFormData.codPuesto}" está ahora disponible para el proyecto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Continuar */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleContinuarPuesto} size="lg" className="px-8">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Nueva pantalla de confirmación de requisitos
  if (showRequisitosConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        {/* Sistema title - appears on all screens */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
        </div>
        <div className="container mx-auto p-6 max-w-lg">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Requisitos del Puesto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-4 text-center">
                <p className="text-sm text-gray-700">
                  Ahora debe continuar con la creación de los requisitos del puesto
                </p>
              </div>
              <div className="flex gap-4 justify-end pt-4">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmarRequisitos}>Confirmar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Sistema title - appears on all screens */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
      </div>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Crear Nuevo Proyecto</h1>
              <p className="text-muted-foreground">
                Ingrese los datos para crear un nuevo proyecto de prácticas profesionales
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>Complete todos los campos requeridos para crear el proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Errores generales */}
            {generalErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-red-800">
                      {generalErrors.map((error, index) => (
                        <div key={index} className="mb-1 last:mb-0">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombreProyecto">
                  Nombre del Proyecto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombreProyecto"
                  value={formData.nombreProyecto}
                  onChange={(e) => handleInputChange("nombreProyecto", e.target.value)}
                  onFocus={() => handleFieldFocus("nombreProyecto")}
                  placeholder="Ingrese el nombre del proyecto"
                  className={`h-12 ${fieldErrors.nombreProyecto ? "border-red-500" : ""}`}
                />
                {fieldErrors.nombreProyecto && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm text-red-800">{fieldErrors.nombreProyecto}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuitEmpresa">
                  CUIT Empresa <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cuitEmpresa"
                  value={formData.cuitEmpresa}
                  onChange={(e) => handleCuitChange(e.target.value, "cuitEmpresa")}
                  onFocus={() => handleCuitFocus("cuitEmpresa")}
                  placeholder="XX-XXXXXXXX-X"
                  maxLength={13}
                  className={`h-12 ${fieldErrors.cuitEmpresa ? "border-red-500" : ""}`}
                />
                {fieldErrors.cuitEmpresa && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm text-red-800">{fieldErrors.cuitEmpresa}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcionProyecto">
                Descripción del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcionProyecto"
                value={formData.descripcionProyecto}
                onChange={(e) => handleInputChange("descripcionProyecto", e.target.value)}
                onFocus={() => handleFieldFocus("descripcionProyecto")}
                placeholder="Describa el proyecto y sus objetivos"
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuitUniversidad">
                CUIT Universidad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cuitUniversidad"
                value={formData.cuitUniversidad}
                onChange={(e) => handleCuitChange(e.target.value, "cuitUniversidad")}
                onFocus={() => handleCuitFocus("cuitUniversidad")}
                placeholder="XX-XXXXXXXX-X"
                maxLength={13}
                className={`h-12 ${fieldErrors.cuitUniversidad ? "border-red-500" : ""}`}
              />
              {fieldErrors.cuitUniversidad && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm text-red-800">{fieldErrors.cuitUniversidad}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fechas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cronograma del Proyecto</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fechaCierrePostulaciones">
                    Fecha Cierre Postulaciones <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fechaCierrePostulaciones"
                    type="date"
                    value={formData.fechaCierrePostulaciones}
                    onChange={(e) => handleInputChange("fechaCierrePostulaciones", e.target.value)}
                    onFocus={() => handleFieldFocus("fechaCierrePostulaciones")}
                    className={`h-12 ${fieldErrors.fechaCierrePostulaciones ? "border-red-500" : ""}`}
                  />
                  {fieldErrors.fechaCierrePostulaciones && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        </div>
                        <div className="ml-2">
                          <div className="text-sm text-red-800">{fieldErrors.fechaCierrePostulaciones}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaInicioActividades">
                    Fecha Inicio Actividades <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fechaInicioActividades"
                    type="date"
                    value={formData.fechaInicioActividades}
                    onChange={(e) => handleInputChange("fechaInicioActividades", e.target.value)}
                    onFocus={() => handleFieldFocus("fechaInicioActividades")}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaFinProyecto">
                    Fecha Fin Proyecto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fechaFinProyecto"
                    type="date"
                    value={formData.fechaFinProyecto}
                    onChange={(e) => handleInputChange("fechaFinProyecto", e.target.value)}
                    onFocus={() => handleFieldFocus("fechaFinProyecto")}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Ejemplos para prueba */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  <strong>Ejemplos para prueba:</strong>
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese cualquier datos válidos para simular la creación de un proyecto nuevo.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese "TCodeNova" para simular nombre de proyecto no válido.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese datos incompletos para simular datos no válidos.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese "20-12345678-9" para simular CUIT de empresa no encontrado.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Ingrese "20-12345678-1" para simular CUIT de universidad no encontrado.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Ingrese una fecha de cierre igual o posterior a la fecha de inicio de actividades para simular
                      error de fechas.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-end mt-8">
          <Button variant="outline" onClick={handleCancel} size="lg">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit} size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Crear Proyecto
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
