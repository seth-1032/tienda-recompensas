
import type { Category } from "../types/product";

interface SearchBarProps {
    search: string;
    categoryId: number | undefined;
    categories: Category[];
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: number | undefined) => void;
}

const SearchBar = ({
    search,
    categoryId,
    categories,
    onSearchChange,
    onCategoryChange,
}: SearchBarProps) => {

    return (
        <div className="catalog-filters">
            <input type="search" placeholder="Buscar productos..." value={search} onChange={(event) => onSearchChange(event.target.value)} />

            <select
                value={categoryId ?? ""}
                onChange={(event) =>
                    onCategoryChange(
                        event.target.value
                            ? Number(event.target.value)
                            : undefined
                    )
                }
>
                <option value="">Todas las categorías</option>

                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SearchBar;
