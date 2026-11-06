
interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    page,
    totalPages,
    onPageChange,
}: PaginationProps) => {

    if (totalPages <= 1)
        return null;

    return (
        <nav className="pagination">
            <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Anterior</button>

            <span> Página {page} de {totalPages} </span>

            <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Siguiente</button>
        </nav>
    );
};

export default Pagination;
