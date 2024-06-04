export function createTable(data: any[][]): JSX.Element {
    return (
        <table>
            {data.map((row, i) => (
                <tr key={i}>
                    {row.map((column, k) => (
                        <td key={k}>{column}</td>
                    ))}
                </tr>
            ))}
        </table>
    );
}


