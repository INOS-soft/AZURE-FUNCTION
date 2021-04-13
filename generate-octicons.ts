/* generate-octicons
 *
 * Utility script for generating a strongly typed representation of all
 * octicons distributed by the octicons NPM package. Enumerates the icons
 * and generates the TypeScript class containing just what Desktop needs.
 */

import * as fs from 'fs'
import * as Path from 'path'
import * as cp from 'child_process'

import xml2js from 'xml2js'
import toCamelCase from 'to-camel-case'

interface IXML2JSNode {
  path: {
    $: {
      d: string
      'fill-rule'?: string
    }
  }
}

interface IOcticonData {
  readonly jsFriendlyName: string
  readonly pathData: string
  readonly width: string
  readonly height: string
  readonly fillRule?: string
}

const viewBoxRe = /0 0 (\d+) (\d+)/

function readXml(xml: string): Promise<IXML2JSNode> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, function (err, result: IXML2JSNode) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

async function generateIconData(): Promise<ReadonlyArray<IOcticonData>> {
  const octicons = require('@primer/octicons')

  const results = new Array<IOcticonData>()

  for (const name of Object.keys(octicons).sort()) {
    const octicon = octicons[name]

    if (octicon.heights.length === 0) {
      throw new Error(`Unexpected empty sizes array for ${octicon.symbol}`)
    }

    // Try to get the 16px version of the SVG data if it exists,
    // if it doesn't just fallback to the version that is defined.
    const octiconData =
      octicon.heights['16'] ?? octicon.heights[Object.keys(octicon.heights)[0]]

    const viewBox = octiconData.options.viewBox
    const viewBoxMatch = viewBoxRe.exec(viewBox)

    if (!viewBoxMatch) {
      throw new Error(
        `Unexpected viewBox format for ${octicon.symbol} - '${viewBox}'`
      )
    }

    const [, width, height] = viewBoxMatch

    const result = await readXml(octiconData.path)
    const pathData = result.path.$.d
    const fillRule = result.path.$['fill-rule']
    const jsFriendlyName = toCamelCase(octicon.symbol)

    results.push({
      jsFriendlyName,
      width,
      height,
      pathData,
      fillRule,
    })
  }

  return results
}

generateIconData().then(result => {
  console.log(`Writing ${result.length} octicons...`)

  const out = fs.createWriteStream(
    Path.resolve(__dirname, '../app/src/ui/octicons/octicons.generated.ts'),
    {
      encoding: 'utf-8',
    }
  )

  out.write('/*\n')
  out.write(
    ' * This file is automatically generated by the generate-octicons tool.\n'
  )
  out.write(' * Manually changing this file will only lead to sadness.\n')
  out.write(' */\n\n')

  out.write('export class OcticonSymbol {\n')

  out.write(
    "\n  public constructor(public w: number, public h: number, public d: string, public fr?: React.SVGAttributes<SVGElement>['fillRule']) { }\n\n"
  )

  result.forEach(function (symbol) {
    const { jsFriendlyName, pathData, width, height, fillRule } = symbol
    out.write(
      `  public static get ${jsFriendlyName}() { return new OcticonSymbol(${width}, ${height}, '${pathData}', ${
        fillRule ? `'${fillRule}'` : 'undefined'
      } ) }\n`
    )
  })

  out.write('}\n')
  out.end()

  console.log('Ensuring generated file is formatted correctly...')
  const root = Path.dirname(__dirname)
  const yarnExecutable = process.platform === 'win32' ? 'yarn.cmd' : 'yarn'
  return cp.spawn(yarnExecutable, ['lint:fix'], { cwd: root, stdio: 'inherit' })
})
