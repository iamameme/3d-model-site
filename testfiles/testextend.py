from PIL import Image
import matplotlib.pyplot as plt

# Paste your get_extended_image function here
def get_extended_image(img, fill_width=100, min_alpha=227):
    import numpy as np
    from PIL import Image
    original_np = np.array(img).astype(np.float32)
    height, width, _ = original_np.shape
    edge_margin = int(fill_width )

    def composite_over_black(pixel):
        r, g, b, a = pixel / 255.0
        return np.array([r * a * 255, g * a * 255, b * a * 255, 255], dtype=np.float32)

    # --- Vertical Fill ---
    for x in range(edge_margin, width - edge_margin):
        alpha_col = original_np[:, x, 3]
        visible_indices = np.where(alpha_col >= min_alpha)[0]
        if len(visible_indices) >= 4:
            top_idx = visible_indices[3]
            bottom_idx = visible_indices[-4]
            top_pixel = composite_over_black(original_np[top_idx, x])
            bottom_pixel = composite_over_black(original_np[bottom_idx, x])

            for y in range(max(0, top_idx - fill_width), top_idx):
                if original_np[y, x, 3] < 255:
                    original_np[y, x] = top_pixel

            for y in range(bottom_idx + 1, min(height, bottom_idx + fill_width + 1)):
                if original_np[y, x, 3] < 255:
                    original_np[y, x] = bottom_pixel

    # --- Horizontal Fill ---
    edge_margin_h = int(edge_margin / 12)
    for y in range(edge_margin_h, height - edge_margin_h):
        row = original_np[y]
        alpha = row[:, 3]
        visible_indices = np.where(alpha >= min_alpha)[0]
        if len(visible_indices) >= 4:
            left_idx = visible_indices[3]
            right_idx = visible_indices[-4]
            left_pixel = composite_over_black(row[left_idx])
            right_pixel = composite_over_black(row[right_idx])

            for x in range(max(edge_margin_h, left_idx - fill_width), left_idx):
                if x >= width - edge_margin_h:
                    continue
                if original_np[y, x, 3] < 255:
                    original_np[y, x] = left_pixel

            for x in range(right_idx + 1, min(width - edge_margin_h, right_idx + fill_width + 1)):
                if x < edge_margin_h:
                    continue
                if original_np[y, x, 3] < 255:
                    original_np[y, x] = right_pixel

    result_img = Image.fromarray(
        np.clip(original_np, 0, 255).astype(np.uint8), "RGBA")
    return result_img


# Open a local image file
input_path = "bacon.png"  # <- Replace with your file path
original_image = Image.open(input_path).convert("RGBA")

# Apply the extension
extended_image = get_extended_image(original_image)

# Display the image using matplotlib
plt.imshow(extended_image)
plt.axis("off")
plt.show()
