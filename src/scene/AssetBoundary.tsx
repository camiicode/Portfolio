import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AssetBoundaryProps {
  /** Rendered instead of the children when the load fails. */
  fallback: ReactNode;
  children: ReactNode;
  /** Name used in the console warning, usually the asset url. */
  label: string;
}

interface AssetBoundaryState {
  failed: boolean;
}

/**
 * Keeps a failed asset — a missing .glb, an unreachable HDR — from taking the
 * whole scene down with it. React boundaries only catch render errors, which is
 * exactly where useGLTF throws once its loader promise rejects.
 */
export class AssetBoundary extends Component<AssetBoundaryProps, AssetBoundaryState> {
  override state: AssetBoundaryState = { failed: false };

  static getDerivedStateFromError(): AssetBoundaryState {
    return { failed: true };
  }

  override componentDidCatch(error: Error, _info: ErrorInfo) {
    console.warn(`[Microcosm] ${this.props.label} unavailable, using fallback —`, error.message);
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
