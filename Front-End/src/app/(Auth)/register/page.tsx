import { RegisterForm } from '@/components/register'
import React from 'react'

const error = [
  {msg:"saad"}
]
export default function Page() {
  console.log(error)
  return (
    <main className=''> 
      <RegisterForm/>
    </main>
  )
}
