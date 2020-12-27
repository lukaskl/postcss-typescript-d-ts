import stylesA from './styles/a.pcss'
import stylesB from './styles/b.pcss'

const assertExistingProperty = <T>(styles: T, prop: keyof T) => {}

{
  assertExistingProperty(stylesA, 'container')
  assertExistingProperty(stylesA, 'container-name')
  assertExistingProperty(stylesA, 'header')
}

{
  assertExistingProperty(stylesB, 'container')
  assertExistingProperty(stylesB, 'name')
}
