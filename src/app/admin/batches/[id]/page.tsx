import { getBatchById } from '@/app/actions/batch-actions'
import BatchDetails from '@/components/Admin/Batches/BatchDetails'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BatchDetailsPage({ params }: PageProps) {
  const { id } = await params
  const res = await getBatchById(id)

  if (!res.success || !res.data) {
    notFound()
  }

  return <BatchDetails batch={res.data} />
}
