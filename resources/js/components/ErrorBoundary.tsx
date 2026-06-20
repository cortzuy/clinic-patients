import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: any) {
        // eslint-disable-next-line no-console
        console.error('ErrorBoundary caught an error', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="rounded-3xl border border-input/60 bg-background p-6 text-sm text-destructive">
                    <p className="font-semibold">Something went wrong.</p>
                    <pre className="mt-2 whitespace-pre-wrap text-xs text-neutral-700">{this.state.error?.message}</pre>
                </div>
            );
        }

        return this.props.children as React.ReactElement;
    }
}
