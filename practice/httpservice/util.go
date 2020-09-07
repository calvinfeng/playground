package httpservice

import (
	"github.com/calvinfeng/playground/practice"
	"github.com/labstack/echo/v4"
	"strconv"
)

func buildFiltersFromContext(c echo.Context) []practice.SQLFilter {
	filters := make([]practice.SQLFilter, 0)

	// TODO: Implement filters
	if c.QueryParam("label_id") != "" {
	}

	return filters
}

const defaultPageSize = uint64(20)
const defaultPageNum = uint64(1)

func getLimitOffsetFromContext(c echo.Context) (uint64, uint64) {
	pageSize := defaultPageSize
	pageNum := defaultPageNum

	if c.QueryParam("page_size") != "" {
		if val, err := strconv.ParseInt(c.QueryParam("page_size"), 10, 64); err == nil {
			pageSize = uint64(val)
		}
	}

	if c.QueryParam("page") != "" {
		if val, err := strconv.ParseInt(c.QueryParam("page"), 10, 64); err == nil {
			pageNum = uint64(val)
		}
	}

	limit := pageSize
	offset := pageSize * (pageNum - 1)
	return limit, offset
}
