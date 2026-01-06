# @ai-engine/form-render

A flexible form rendering library built with React and Vite.

## Installation

```bash
npm install @ai-engine/form-render
```

## Usage

```tsx
import FormRender, { FormRenderProps } from '@ai-engine/form-render';

const MyForm: React.FC = () => {
  const schema = {
    // Define your form schema here
  };

  const handleSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  return (
    <FormRender 
      schema={schema} 
      onSubmit={handleSubmit} 
    />
  );
};
```

## Development

To run the development server:

```bash
cd packages/form-render
npm run dev
```

To build the library:

```bash
npm run build
```