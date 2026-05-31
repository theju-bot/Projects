import { useState, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '../store/hooks'
import { setSelectedSite } from '../store/slices/sitesSlice'
import client from '../api/client'
import type { Site } from '../types/types'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Field, FieldLabel, FieldError } from '../components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'

const siteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domain: z.string().min(1, 'Domain is required'),
})

type SiteForm = z.infer<typeof siteSchema>

const getScript = (siteId: string) => `<script>
(function () {
  const SITE_ID = '${siteId}'
  const API_URL = '${import.meta.env.VITE_API_URL}/events'

  function getOS() {
    const ua = navigator.userAgent
    if (/Windows/.test(ua)) return 'Windows'
    if (/Mac/.test(ua)) return 'MacOS'
    if (/Linux/.test(ua)) return 'Linux'
    if (/Android/.test(ua)) return 'Android'
    if (/iPhone|iPad/.test(ua)) return 'iOS'
    return 'Unknown'
  }

  function getBrowser() {
    const ua = navigator.userAgent
    if (/Chrome/.test(ua) && !/Edg/.test(ua)) return 'Chrome'
    if (/Firefox/.test(ua)) return 'Firefox'
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari'
    if (/Edg/.test(ua)) return 'Edge'
    return 'Unknown'
  }

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: SITE_ID,
      type: 'pageview',
      path: window.location.pathname,
      referrer: document.referrer,
      browser: getBrowser(),
      os: getOS(),
    }),
  })
})()
</script>`

const Sites = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState('')

  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: async () => {
      const res = await client.get<Site[]>('/sites')
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/sites/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteForm>({
    resolver: zodResolver(siteSchema),
    defaultValues: { name: '', domain: '' },
  })

  const onSubmit = (data: SiteForm) => {
    startTransition(async () => {
      try {
        await client.post('/sites', data)
        queryClient.invalidateQueries({ queryKey: ['sites'] })
        reset()
        setOpen(false)
      } catch (err) {
        console.error(err)
        setServerError('Failed to create site.')
      }
    })
  }

  const handleSiteClick = (site: Site) => {
    dispatch(setSelectedSite(site))
    navigate(`/dashboard/${site._id}`)
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Your Sites</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Site</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-4'
            >
              <Field>
                <FieldLabel>Site Name</FieldLabel>
                <Input {...register('name')} placeholder='My Website' />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <FieldLabel>Domain</FieldLabel>
                <Input {...register('domain')} placeholder='example.com' />
                <FieldError errors={[errors.domain]} />
              </Field>

              <FieldError errors={[{ message: serverError }]} />

              <Button type='submit' disabled={isPending} className='w-full'>
                {isPending ? 'Creating...' : 'Create Site'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className='text-muted-foreground'>Loading...</p>}

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {sites.map((site) => (
          <Card
            key={site._id}
            className='cursor-pointer hover:border-primary transition-colors'
            onClick={() => handleSiteClick(site)}
          >
            <CardHeader>
              <CardTitle>{site.name}</CardTitle>
              <CardDescription>{site.domain}</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-between'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={(e) => e.stopPropagation()}
                  >
                    Get Script
                  </Button>
                </DialogTrigger>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                  <DialogHeader>
                    <DialogTitle>Tracking Script</DialogTitle>
                  </DialogHeader>
                  <p className='text-sm text-muted-foreground mb-2'>
                    Paste this inside the <code>&lt;head&gt;</code> of your
                    website.
                  </p>
                  <pre className='bg-muted text-sm rounded-md p-4 overflow-x-auto whitespace-pre-wrap break-all'>
                    {getScript(site._id)}
                  </pre>
                  <Button
                    variant='outline'
                    onClick={() =>
                      navigator.clipboard.writeText(getScript(site._id))
                    }
                  >
                    Copy Script
                  </Button>
                </DialogContent>
              </Dialog>

              <Button
                variant='destructive'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation()
                  deleteMutation.mutate(site._id)
                }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Sites
