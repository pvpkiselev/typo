'use client'

import { ChangeEvent } from 'react'

import { useTypo } from '@/hooks/useTypo'
import { cn } from '@/lib/utils'
import { useTypoStore } from '@/store/useTypoStore'
import type { DisplayMode, FormatMode } from '@/types/typoTypes'

import { CopyButton } from './CopyButton'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Textarea } from './ui/textarea'

interface TextDisplayAreaProps {
  value: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  readOnly?: boolean
  isHtml?: boolean
}

interface FormatModeTabsProps {
  formatMode: FormatMode
  setFormatMode: (formatMode: FormatMode) => void
}

interface DisplayModeTabsProps {
  displayMode: DisplayMode
  setDisplayMode: (displayMode: DisplayMode) => void
}

interface HighlightSwitchProps {
  isHighlightingResult: boolean
  setViewMode: (val: boolean) => void
}

function TextDisplayArea(props: TextDisplayAreaProps) {
  const { value, onChange, className, readOnly = false, isHtml = false } = props

  if (isHtml) {
    return (
      <pre
        className={cn(
          'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 word-wrap:break-word bg-muted field-sizing-content min-h-16 w-full rounded-md p-4 font-sans text-base/normal font-normal whitespace-pre-wrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    )
  }

  return (
    <Textarea
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 field-sizing-content min-h-16 w-full rounded-md border bg-transparent p-4 text-base/normal shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  )
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

function DisplayModeTabs(props: DisplayModeTabsProps) {
  const { displayMode, setDisplayMode } = props

  return (
    <>
      <Tabs value={displayMode} onValueChange={(val) => setDisplayMode(val as DisplayMode)}>
        <TabsList>
          <TabsTrigger value="original">Raw</TabsTrigger>
          <TabsTrigger value="codeHighlighted">Result</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  )
}

export function TypoContainer() {
  const { input, setInput, format, loading, error } = useTypo()
  const { isHighlightingResult, setViewMode, result, formatMode, setFormatMode, displayMode, setDisplayMode } =
    useTypoStore((state) => state)

  const { contentToDisplay, isHtmlContent } = (() => {
    switch (displayMode) {
      case 'original':
        return { contentToDisplay: input, isHtmlContent: false }
      case 'codeHighlighted':
        return { contentToDisplay: result.codeHighlighted, isHtmlContent: true }
      case 'preview':
        const previewContent = isHighlightingResult ? result.previewHighlighted : result.previewResult
        return { contentToDisplay: previewContent, isHtmlContent: true }
      default:
        return { contentToDisplay: '', isHtmlContent: false }
    }
  })()

  const textToCopy = result.code ? result.code : input

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex w-full min-w-64 flex-col gap-4">
        <div className="flex min-h-10 w-full flex-wrap gap-4">
          <DisplayModeTabs displayMode={displayMode} setDisplayMode={setDisplayMode} />

          {displayMode === 'preview' && (
            <HighlightSwitch isHighlightingResult={isHighlightingResult} setViewMode={setViewMode} />
          )}

          <CopyButton variant="secondary" textToCopy={textToCopy} />
        </div>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        <TextDisplayArea
          className="h-fit min-h-64 resize-none"
          value={displayMode === 'original' ? input : contentToDisplay}
          onChange={(e) => setInput(e.target.value)}
          readOnly={displayMode !== 'original'}
          isHtml={displayMode !== 'original' && isHtmlContent}
        />
      </div>

      <div className="bg-background sticky right-0 bottom-0 left-0 z-10 flex w-full flex-wrap justify-center gap-4 py-4">
        <FormatModeTabs formatMode={formatMode} setFormatMode={setFormatMode} />

        <Button className="w-fit min-w-32" onClick={format} disabled={loading}>
          {loading ? 'Formatting...' : 'Format'}
        </Button>
      </div>
    </div>
  )
}
