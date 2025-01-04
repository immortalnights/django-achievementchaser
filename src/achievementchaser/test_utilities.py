from unittest.mock import patch
from typing import Any


def patch_request():
    return patch("achievementchaser.steam._request")


def mock_request(*, ok=True, data: Any = None):
    def inner(fn):
        def test_internal(self):
            _patch = patch_request()
            mock_request = _patch.start()
            if isinstance(data, list):
                side_effect = map(lambda data: (ok, data), data)
                mock_request.side_effect = side_effect
            else:
                mock_request.return_value = (ok, data)
            res = fn(self, mock_request=mock_request)
            _patch.stop()
            return res

        return test_internal

    return inner
