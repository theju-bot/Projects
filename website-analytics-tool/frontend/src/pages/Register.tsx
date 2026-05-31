import { useEffect, useTransition } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import client from '../api/client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Field, FieldLabel, FieldError } from '../components/ui/field'

const registerSchema = z
  .object({
    email: z.string().check(z.email('Invalid email address')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

const Register = () => {
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    document.title = 'Register — Analytics'
  }, [])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterForm) => {
    startTransition(async () => {
      try {
        await client.post('/auth/register', {
          email: data.email,
          password: data.password,
        })
        navigate('/login')
      } catch (error) {
        setServerError('Registration failed. Try again later.')
      }
    })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Register</CardTitle>
          <CardDescription>
            Monitor your websites and uncover what drives your traffic
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
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

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input type='password' {...register('confirmPassword')} />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            <FieldError errors={[{ message: serverError }]} />

            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <p className='text-sm text-muted-foreground'>
            Already have an account?&nbsp;
            <Link to='/login' className='text-primary hover:underline'>
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
