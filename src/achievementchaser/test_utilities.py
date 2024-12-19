from unittest.mock import patch
from typing import Any


def mock_request(*, ok=True, data: Any = None):
    def inner(fn):
        def test_internal(self):
            mock = patch("achievementchaser.steam._request")
            mock_request = mock.start()
            mock_request.return_value = (ok, data)
            res = fn(self, mock_request=mock_request)
            mock.stop()
            return res

        return test_internal

    return inner
