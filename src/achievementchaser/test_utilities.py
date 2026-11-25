from typing import Any
from unittest.mock import patch


def patch_request():
    return patch("achievementchaser.steam._request")


def mock_request(*, ok=True, data: Any = None):
    def inner(fn):
        def test_internal(self):
            _patch = patch_request()
            mock_request = _patch.start()
            if isinstance(data, list):
                side_effect = [(ok, d) for d in data]
                mock_request.side_effect = side_effect
            else:
                mock_request.return_value = (ok, data)
            res = fn(self, mock_request=mock_request)
            _patch.stop()
            return res

        return test_internal

    return inner
