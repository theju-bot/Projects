import { useState, useTransition, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/authSlice'
import client from '../api/client'
import type { User } from '../types/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Field, FieldLabel, FieldError } from '../components/ui/field'

const loginSchema = z.object({
  email: z.string().check(z.email('Invalid email address')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    document.title = 'Login — Analytics'
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginForm) => {
    startTransition(async () => {
      try {
        const res = await client.post<{ user: User }>('/auth/login', data)
        dispatch(setUser(res.data.user))
        navigate('/')
      } catch (err) {
        console.error(err)
        setServerError('Invalid email or password')
      }
    })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type='email' {...register('email')} />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input type='password' {...register('password')} />
              <FieldError errors={[errors.password]} />
            </Field>

            <FieldError errors={[{ message: serverError }]} />

            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className='text-sm text-muted-foreground'>
            Don't have an account?&nbsp;
            <Link to='/register' className='text-primary hover:underline'>
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
