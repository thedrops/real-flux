import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'Ocorreu um erro durante a autenticação';

  if (error === 'CredentialsSignin') {
    errorMessage = 'Email ou senha incorretos';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erro de Autenticação</h1>
        <p className="text-gray-700">{errorMessage}</p>
        <a
          href="/"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Voltar para o login
        </a>
      </div>
    </div>
  );
}
