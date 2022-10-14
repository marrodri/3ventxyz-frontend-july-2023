// author: Ben
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/auth'

import React, { FormEvent, useState } from 'react'
import AllowlistService from '../../services/allowlists'
import Button from '../../components/button'
import ErrorAlert from '../../components/alerts/errorAlert'

export default function CreateAllowlist() {
  const auth = useAuth()
  const router = useRouter()
  const titleRef = React.createRef<HTMLInputElement>()
  const descriptionRef = React.createRef<HTMLInputElement>()
  const allowlistRef = React.createRef<HTMLTextAreaElement>()
  const allowlistService = new AllowlistService()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await allowlistService.create(
        allowlistRef.current?.value ?? '',
        titleRef.current?.value ?? '',
        descriptionRef.current?.value ?? '',
        auth.currentUser?.uid ?? ''
      )

      if (!response?.success) {
        throw Error(response?.message)
      } else {
        router.push('/creator')
      }
    } catch (error) {
      console.log(error)
      setError((error as Error).message)
    }
    setLoading(false)
  }

  return (
    <div className="flex w-screen bg-secondaryBg pb-[100px] pt-[35px]">
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-start justify-start space-y-4">
        <h3 className="w-full max-w-[600px] border-b border-disabled">
          Allowlist
        </h3>
        <form className="m-4 w-full" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-900 "
            >
              TITLE
            </label>
            <input
              type="text"
              id="title"
              ref={titleRef}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900 "
            >
              DESCRIPTION
            </label>
            <input
              type="text"
              id="description"
              ref={descriptionRef}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              ADDRESSES
            </label>
            <textarea
              id="message"
              rows={4}
              ref={allowlistRef}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add the list of addresses separated with comma"
              required
            ></textarea>
          </div>
          <Button
            type="submit"
            text="Create"
            active={!loading}
            onClick={() => null}
          ></Button>
          {error && (
            <ErrorAlert
              title="Oops!"
              description={error}
              onClose={() => setError('')}
            />
          )}
        </form>
      </div>
    </div>
  )
}