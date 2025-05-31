'use client'

import { useTypo } from '@/hooks/useTypo'
import { cn } from '@/lib/utils'
import { FormatResult, useTypoStore } from '@/store/useTypoStore'
import { FormatMode } from '@/types/typoTypes'

import { CopyButton } from './CopyButton'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Textarea } from './ui/textarea'

interface TextPreviewProps {
  isHighlightingResult: boolean
  result: FormatResult
  className?: string
}

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

interface FormatModeTabsProps {
  formatMode: FormatMode
  setFormatMode: (formatMode: FormatMode) => void
}

interface HighlightSwitchProps {
  isHighlightingResult: boolean
  setViewMode: (val: boolean) => void
}

function HighlightSwitch(props: HighlightSwitchProps) {
  const { isHighlightingResult, setViewMode } = props

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          checked={isHighlightingResult}
          onCheckedChange={() => setViewMode(!isHighlightingResult)}
          id="view-mode"
        />
        <Label htmlFor="view-mode">Highlight Changes</Label>
      </div>
    </>
  )
}

function FormatModeTabs(props: FormatModeTabsProps) {
  const { formatMode, setFormatMode } = props

  return (
    <>
      <Tabs value={formatMode} onValueChange={(val) => setFormatMode(val as FormatMode)}>
        <TabsList>
          <TabsTrigger value="symbol">Symbol</TabsTrigger>
          <TabsTrigger value="name">Name</TabsTrigger>
          <TabsTrigger value="digit">Digit</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  )
}

function TextEditor(props: TextEditorProps) {
  const { value, onChange, className } = props

  return (
    <>
      <Textarea
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter Text..."
      />
    </>
  )
}

function TextPreview(props: TextPreviewProps) {
  const { isHighlightingResult, result, className } = props

  const displayText = isHighlightingResult ? result.highlighted : result.result

  return (
    <div
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 field-sizing-content min-h-16 w-full rounded-md border bg-transparent p-4 text-base/normal shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      dangerouslySetInnerHTML={{
        __html: displayText,
      }}
    />
  )
}

export function TypoContainer() {
  const { input, setInput, format, loading, error } = useTypo()
  const { isHighlightingResult, setViewMode, result, formatMode, setFormatMode } = useTypoStore((state) => state)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="flex w-full min-w-64 flex-1 flex-col gap-4">
          <div className="flex min-h-10 w-full flex-wrap gap-4">
            <FormatModeTabs formatMode={formatMode} setFormatMode={setFormatMode} />

            <Button className="w-fit min-w-32" onClick={format} disabled={loading}>
              {loading ? 'Formatting...' : 'Format'}
            </Button>
          </div>

          <TextEditor className="h-fit min-h-64 resize-none" value={input} onChange={setInput} />
        </div>

        <div className="flex w-full min-w-64 flex-1 flex-col gap-4">
          <div className="flex min-h-10 w-full flex-wrap gap-4">
            <HighlightSwitch isHighlightingResult={isHighlightingResult} setViewMode={setViewMode} />

            <CopyButton variant="secondary" textToCopy={result.result} />
          </div>

          <TextPreview
            isHighlightingResult={isHighlightingResult}
            result={result}
            className="pre-wrap h-fit min-h-64 whitespace-pre-wrap"
          />
        </div>
      </div>

      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  )
}
