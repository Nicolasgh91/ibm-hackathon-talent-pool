interface ComingSoonProps {
  feature: string
}

/** Placeholder para rutas reservadas sin backend (reutilizable desde cualquier ruta). */
export function ComingSoon({ feature }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-2xl font-semibold text-gray-900">{feature}</h1>
      <p className="mt-2 text-gray-600">
        Esta funcionalidad estará disponible próximamente.
      </p>
    </div>
  )
}
