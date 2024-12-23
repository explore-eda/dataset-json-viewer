export default function StatusBar({ statusText }) {
        return (
            <div className="fixed bottom-5 left-5 text-xl">
              {statusText}
            </div>
        );
}