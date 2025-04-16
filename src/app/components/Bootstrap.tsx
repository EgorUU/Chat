
import dynamic from 'next/dynamic';

const Bootstrap = dynamic(
  () => import('bootstrap/dist/js/bootstrap.bundle.min.js'),
  { ssr: false }
);

export default function ClientBootstrap() {
  return <Bootstrap />;
}